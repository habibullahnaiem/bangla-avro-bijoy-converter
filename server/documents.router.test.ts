import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  listStoredDocuments: vi.fn(),
  createStoredDocument: vi.fn(),
  getStoredDocumentForOwner: vi.fn(),
  removeStoredDocumentForOwner: vi.fn(),
}));

const storageMocks = vi.hoisted(() => ({
  storagePut: vi.fn(),
  storageGetSignedUrl: vi.fn(),
}));

vi.mock("./db", () => dbMocks);
vi.mock("./storage", () => storageMocks);

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

const storedDocument = {
  id: 42,
  ownerUserId: 7,
  fileName: "personal-note.txt",
  mimeType: "text/plain",
  byteSize: 3,
  storageKey: "users/7/documents/private.txt",
  storageUrl: "/manus-storage/users/7/documents/private.txt",
  source: "upload" as const,
  direction: "u2b" as const,
  createdAt: new Date("2026-08-24T00:00:00.000Z"),
};

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUser(): AuthenticatedUser {
  return {
    id: 7,
    openId: "document-owner",
    email: "owner@example.com",
    name: "Document Owner",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

describe("documents router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires sign-in before any private document action", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(caller.documents.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.documents.download({ id: 42 })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    expect(dbMocks.listStoredDocuments).not.toHaveBeenCalled();
    expect(dbMocks.getStoredDocumentForOwner).not.toHaveBeenCalled();
  });

  it("rejects unsupported document MIME types before accessing storage", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    await expect(
      caller.documents.upload({
        fileName: "not-a-document.pdf",
        mimeType: "application/pdf" as never,
        contentBase64: "YWJj",
        source: "upload",
        direction: "u2b",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(storageMocks.storagePut).not.toHaveBeenCalled();
    expect(dbMocks.createStoredDocument).not.toHaveBeenCalled();
  });

  it("rejects a filename whose extension conflicts with the requested document type", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    await expect(
      caller.documents.upload({
        fileName: "mislabelled.docx",
        mimeType: "text/plain",
        contentBase64: "YWJj",
        source: "upload",
        direction: "u2b",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(storageMocks.storagePut).not.toHaveBeenCalled();
    expect(dbMocks.createStoredDocument).not.toHaveBeenCalled();
  });

  it("stores only metadata under the authenticated owner after uploading to managed storage", async () => {
    storageMocks.storagePut.mockResolvedValue({
      key: "users/7/documents/private_123.txt",
      url: "/manus-storage/users/7/documents/private_123.txt",
    });
    const caller = appRouter.createCaller(createContext(createUser()));

    await expect(
      caller.documents.upload({
        fileName: "personal-note.txt",
        mimeType: "text/plain",
        contentBase64: "YWJj",
        source: "upload",
        direction: "u2b",
      }),
    ).resolves.toEqual({ success: true });

    expect(storageMocks.storagePut).toHaveBeenCalledWith(
      expect.stringContaining("users/7/documents/"),
      expect.any(Buffer),
      "text/plain",
    );
    expect(dbMocks.createStoredDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerUserId: 7,
        fileName: "personal-note.txt",
        byteSize: 3,
        storageKey: "users/7/documents/private_123.txt",
      }),
    );
  });

  it("only returns a signed URL after the owner-scoped record lookup", async () => {
    dbMocks.getStoredDocumentForOwner.mockResolvedValue(storedDocument);
    storageMocks.storageGetSignedUrl.mockResolvedValue("https://signed.example.test/private.txt");
    const caller = appRouter.createCaller(createContext(createUser()));

    await expect(caller.documents.download({ id: 42 })).resolves.toEqual({
      fileName: "personal-note.txt",
      url: "https://signed.example.test/private.txt",
    });

    expect(dbMocks.getStoredDocumentForOwner).toHaveBeenCalledWith(42, 7);
    expect(storageMocks.storageGetSignedUrl).toHaveBeenCalledWith(
      "users/7/documents/private.txt",
    );
  });
});
