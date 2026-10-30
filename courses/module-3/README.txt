Module 3 - Nutrients Utilisation in Human: Metabolic Pathways - xAPI (Tin Can) package
---------------------------------------------------------------------------------------
Upload this zip as-is to any xAPI-capable LMS (tincan.xml is at the root).
Launch file: index.html

Activity ID: https://wiseprogramme.com/xapi/courses/nutrients-utilisation-in-human
(change it in tincan.xml and js/xapi.js -> COURSE.id if you need your own IRI)

Sections
  1. Introduction and Carbohydrate Metabolism  (video + 6 animated lessons)
  2. Lipid and Protein Metabolism               (video + 7 animated lessons)
  3. Bringing It All Together                   (video + 4 animated lessons)
  Pocket notes (view/zoom/download) + slide deck PDF download
  Knowledge check: 4 questions, no pass mark (unlocks after all 3 sections)

The LMS passes endpoint, auth, actor, registration and activity_id on the
launch URL. Statements sent: initialized/resumed, experienced (each lesson as it scrolls into view),
played (each video), interacted, downloaded, completed (each section),
answered (each question), completed (knowledge check, with score),
completed (course, with score, once the knowledge check is finished),
terminated. There is no pass mark, so no passed/failed statements. Progress is saved with the
xAPI State API so learners resume where they left off.

Opened without an LRS, the course runs in preview mode and saves progress
in the browser only. Videos stream from Brightcove, so an internet
connection is needed for them.
