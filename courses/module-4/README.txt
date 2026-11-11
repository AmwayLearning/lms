Module 4 - Nutrition Throughout the Life Stages - xAPI (Tin Can) package
-----------------------------------------------------------------------
Upload this zip as-is to any xAPI-capable LMS (tincan.xml is at the root).
Launch file: index.html
Thumbnail: assets/img/thumbnail.jpg

Activity ID: https://wiseprogramme.com/xapi/courses/nutrition-throughout-life-stages
(change it in tincan.xml and js/xapi.js -> COURSE.id if you need your own IRI)

Sections (swipeable one-screen lessons, based on the Module 4 slide deck)
  1. Why it matters (2 screens + section complete)
  2. Building the foundation: preconception to age 8 (4 screens + section complete)
  3. The engine room: ages 9-39 (4 screens + section complete)
  4. Preservation & protection: ages 40-90+ (5 screens + section complete)
  5. Universal truths (3 screens + section complete)
  Pocket notes: 2 pages, view and zoom only (no download)
  PDF slides: downloadable (assets/docs/Module_4_Nutrition_Throughout_Life_Stages_Slides.pdf).
              Set AMWAY_PLUS_URL at the top of js/app.js for the Amway+ copy-link box.
  Knowledge check: 3 questions, no pass mark (unlocks after all 5 sections)

The LMS passes endpoint, auth, actor, registration and activity_id on the
launch URL. Statements sent: initialized/resumed, experienced (each screen),
interacted, completed (each section, when its last screen is reached), answered (each question),
completed (knowledge check, with score), completed (course, with score),
terminated. Progress is saved with the xAPI State API so learners resume
on the screen they left.

Opened without an LRS, the course runs in preview mode and saves progress
in the browser only.
