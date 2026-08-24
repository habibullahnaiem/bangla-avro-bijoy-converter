import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storageGetSignedUrl, storagePut } from "./storage";

const MAX_STORED_DOCUMENT_BYTES = 8 * 1024 * 1024;
const MAX_STORED_DOCUMENT_BASE64_LENGTH = Math.ceil((MAX_STORED_DOCUMENT_BYTES * 4) / 3) + 16;
const docInput = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.enum([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]),
  contentBase64: z.string().min(1).max(MAX_STORED_DOCUMENT_BASE64_LENGTH),
  source: z.enum(["upload", "converted"]),
  direction: z.enum(["u2b", "b2u"]),
});

const documentIdInput = z.object({ id: z.number().int().positive() });

function safeFileName(fileName: string) {
  const normalized = fileName
    .normalize("NFC")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
    .trim();
  return normalized.slice(0, 255) || "avrojoy-document";
}

function decodeDocumentBase64(contentBase64: string) {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(contentBase64)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid document encoding" });
  }
  const bytes = Buffer.from(contentBase64, "base64");
  if (!bytes.length || bytes.length > MAX_STORED_DOCUMENT_BYTES) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Document exceeds 8 MB limit" });
  }
  return bytes;
}

function validateDocumentFileName(
  fileName: string,
  mimeType: "text/plain" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
) {
  const expectedExtension = mimeType === "text/plain" ? ".txt" : ".docx";
  if (!fileName.toLowerCase().endsWith(expectedExtension)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Document filename does not match its type",
    });
  }
}

function mapStoredDocument(document: {
  id: number;
  fileName: string;
  mimeType: string;
  byteSize: number;
  source: "upload" | "converted";
  direction: "u2b" | "b2u";
  createdAt: Date;
}) {
  return {
    id: document.id,
    fileName: document.fileName,
    mimeType: document.mimeType,
    byteSize: document.byteSize,
    source: document.source,
    direction: document.direction,
    createdAt: document.createdAt,
  };
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  documents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const rows = await db.listStoredDocuments(ctx.user.id);
      return rows.map(mapStoredDocument);
    }),
    upload: protectedProcedure.input(docInput).mutation(async ({ ctx, input }) => {
      const bytes = decodeDocumentBase64(input.contentBase64);
      const fileName = safeFileName(input.fileName);
      validateDocumentFileName(fileName, input.mimeType);
      const extension = input.mimeType === "text/plain" ? "txt" : "docx";
      const storagePrefix = `users/${ctx.user.id}/documents/${Date.now()}-${nanoid(10)}`;
      const { key, url } = await storagePut(
        `${storagePrefix}-${fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`}`,
        bytes,
        input.mimeType,
      );

      await db.createStoredDocument({
        ownerUserId: ctx.user.id,
        fileName,
        mimeType: input.mimeType,
        byteSize: bytes.length,
        storageKey: key,
        storageUrl: url,
        source: input.source,
        direction: input.direction,
      });

      return { success: true } as const;
    }),
    download: protectedProcedure.input(documentIdInput).mutation(async ({ ctx, input }) => {
      const document = await db.getStoredDocumentForOwner(input.id, ctx.user.id);
      if (!document) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }
      return {
        fileName: document.fileName,
        url: await storageGetSignedUrl(document.storageKey),
      };
    }),
    remove: protectedProcedure.input(documentIdInput).mutation(async ({ ctx, input }) => {
      const document = await db.getStoredDocumentForOwner(input.id, ctx.user.id);
      if (!document) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }
      await db.removeStoredDocumentForOwner(input.id, ctx.user.id);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
