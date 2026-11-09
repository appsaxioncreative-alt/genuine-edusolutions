GENUINE EDU-SOLUTIONS ADMIN PANEL
=================================
Files: admin.html, admin.css, admin.js, firestore.rules

1) Put admin.html, admin.css and admin.js in the same folder as your index.html
   (the assets folder with icon.jpg is reused for the tab icon).
   Open:  yoursite.com/admin.html

2) Firebase Console
   a) Build > Authentication > Get started > enable "Email/Password".
   b) Build > Firestore Database > Rules: replace with firestore.rules, then Publish.
      (If you have extra collections of your own, merge instead of replacing.)

3) First visit to admin.html shows "Create the owner account" because no admin
   exists yet. Create it right away. After that the sign-up page is locked and
   only existing admins can add people (Admins tab).

4) Tabs: Overview (stats), Enquiries (search, status, notes, delete),
   Visitors (scroll depth, time, clicks), Admins (add / remove).

Security notes
- Do this setup immediately after publishing the rules, before anyone else finds the page.
- Removing an admin revokes dashboard access; their login account stays in Firebase Auth
  (delete it there if you want it gone).
- Run with a local server / http(s), not by double-clicking the file.
