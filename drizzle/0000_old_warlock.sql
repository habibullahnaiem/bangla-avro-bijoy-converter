CREATE TABLE `storedDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerUserId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(127) NOT NULL,
	`byteSize` int NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`storageUrl` varchar(768) NOT NULL,
	`source` enum('upload','converted') NOT NULL,
	`direction` enum('u2b','b2u') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `storedDocuments_id` PRIMARY KEY(`id`),
	CONSTRAINT `storedDocuments_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `storedDocuments` ADD CONSTRAINT `storedDocuments_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `stored_documents_owner_created_idx` ON `storedDocuments` (`ownerUserId`,`createdAt`);