# ওয়েব/ডেস্কটপের অবশিষ্ট ফ্যাকাসে সারফেস — যাচাইকৃত নোট

ব্যবহারকারীর ২০২৬-০৮-২৪-এর desktop screenshot-এর ordered crop দেখে নিম্নোক্ত সারফেস নিশ্চিত করা হয়েছে।

1. ইনপুট editor footer-এর পেস্ট control row এখনও হালকা `bg-muted/50` surface ব্যবহার করছে।
2. আউটপুট editor footer-এর Copy to Clipboard row একইভাবে হালকা surface ব্যবহার করছে।
3. font legend-এর ছোট `সোলাইমান লিপি` এবং `SutonnyMJ` badge দুটি muted-light background ও pale text-এ রয়েছে।
4. recent-history-এর empty-state card পুরো desktop width জুড়ে pale `bg-card/70` surface-এ রেন্ডার হচ্ছে; title, supporting text ও clock icon-ও যথেষ্ট contrast পাচ্ছে না।

এগুলো একই opaque dark-teal workbench surface ও readable text/border system পাবে। কনভার্সন, DOCX/TXT, native selection/copy এবং PWA logic অপরিবর্তিত থাকবে।
