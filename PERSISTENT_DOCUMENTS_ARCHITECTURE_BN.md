# অভ্রজয় — স্থায়ী নথি সংরক্ষণ নকশা

## উদ্দেশ্য

ব্যবহারকারী সাইন ইন করার পর নিজের DOCX বা TXT নথি ব্যক্তিগত সংগ্রহে রাখতে পারবেন। রূপান্তরের সাধারণ text history আগের মতো ডিভাইসের local storage-এই থাকবে; ব্যবহারকারীর লেখা নীরবে server-এ সংরক্ষণ করা হবে না।

## তথ্যের অবস্থান

| তথ্য | সংরক্ষণের স্থান | কারণ |
|---|---|---|
| নথির bytes | Managed S3 File Storage | Database-এ বড় file blob না রেখে নিরাপদ ও স্কেলযোগ্য সংরক্ষণ |
| নথির নাম, MIME type, size, direction, storage key এবং সময় | Database | মালিকভিত্তিক তালিকা, যাচাই ও download authorization |
| মালিকের পরিচয় | Built-in authenticated user table | প্রতিটি নথি কেবল তার সাইন-ইন করা মালিক দেখতে পারবেন |

## গোপনীয়তা ও access control

প্রতিটি storage mutation authenticated user ছাড়া চলবে না। Database query সবসময় `ownerUserId` দিয়ে সীমাবদ্ধ থাকবে। Download-এর সময়ও ownership যাচাই করে স্বল্পমেয়াদি signed URL দেওয়া হবে। ব্যবহারকারী delete করলে database record সরবে; managed storage-এর key আর application থেকে প্রকাশ করা হবে না।

## প্রথম সংস্করণের সীমা

শুধু `.docx` ও `.txt` নথি গ্রহণ করা হবে এবং প্রতিটি upload সর্বোচ্চ 8 MB হবে। ব্যবহারকারী নিজে “আমার নথিতে সংরক্ষণ করুন” চাপলেই file স্থায়ীভাবে রাখা হবে।
