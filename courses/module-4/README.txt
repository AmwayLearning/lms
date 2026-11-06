Module 4 - Nutrition Throughout the Life Stages - xAPI (Tin Can) package
-----------------------------------------------------------------------
Upload this zip as-is to any xAPI-capable LMS (tincan.xml is at the root).
Launch file: index.html
Thumbnail: assets/img/thumbnail.jpg

Activity ID: https://wiseprogramme.com/xapi/courses/nutrition-throughout-life-stages
(change it in tincan.xml and js/xapi.js -> COURSE.id if you need your own IRI)

Sections (swipeable one-screen lessons)
  1. Preconception, Pregnancy & Early Childhood
  2. School-age & Adolescence (9-18 years)
  3. Young Adulthood to Midlife (19-64 years)
  4. Elderly (65+ years)
  5. Universal Nutritional Guidelines
  Pocket notes: 2 pages, view and zoom only (no download)
  PDF slides: "coming soon" - put the PDF in assets/docs and set PDF_FILE
              (and AMWAY_PLUS_URL for the Amway+ copy-link box) at the top of js/app.js
  Knowledge check: 3 questions, no pass mark (unlocks after all 5 sections)

The LMS passes endpoint, auth, actor, registration and activity_id on the
launch URL. Statements sent: initialized/resumed, experienced (each screen),
interacted, completed (each section), answered (each question),
completed (knowledge check, with score), completed (course, with score),
terminated. Progress is saved with the xAPI State API so learners resume
on the screen they left.

Opened without an LRS, the course runs in preview mode and saves progress
in the browser only.
