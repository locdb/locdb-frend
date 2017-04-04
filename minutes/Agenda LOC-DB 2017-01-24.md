# Agenda LOC-DB 2017-01-24

9:00 Welcome and introduction of the new project team member in Mannheim

9:10 Review of the agenda

9:20 Review of the project schedule (month 4):
- Overall concept is almost finished (all)
	- iterative process? start with something and then optimize later
	- proposal is also quite old now
	- let us go to the next points and see ...
- Cataloguing processes are being developed (Annette)
	- the bigger part of scanning (341) of publications is done (author works, collections)
	- new book -> catalog in SWB -> enter PPN in LOC-DB as starting point of data
	- currently articles in collections are just numbered from 1...n
		- dangerous, error-prone, one mis-alignment will create a lot of wrong claimed citations
		- maybe add a word from the title in the file name? -> difficult in practical workflow
		- maybe add the page number(s) as stable and easy entry point
	- can start now on the other things needed for the workflow
- Provisional data model exists (Kai/Anne)
	- started with the open citation model
	- in owncloud document
	- we need to extend to info from scanning (suggestions are welcomed!)
- Implementation of the backend is prepared (Kai/Anne)
	- server is up and running
	- MongoDB, NodeJS 
	- Swagger interface: http://velsen.informatik.uni-mannheim.de/docs/
	- GitHub: https://github.com/anlausch/loc-db
- Integration of data sources for metadata is started (Kai/Anne)
	- MARC21 to open citation model transformation
	- started with the A++ model from Springer
- Automated data extraction: separation of items from OCR-texts works, provisional metadata is available (Sheraz/Akansha)
	- Slides 
	- Ground truth for training
		- [Sloth](https://github.com/cvhciKIT/sloth) for annotation taks
			- choose some represantive images
			- as much as possible
			- all images which are already scanned?
		- HTML files for gt text data
			- ocropy-gt-tools
			- https://github.com/UB-Mannheim/ocr-gt-tools
			- https://github.com/not-implemented/hocr-proofreader
		- Parscit 
	- Double page scans
		- are more efficiantly and not all scanners can split them automatically
		- maybe press a button to indicate manually that this is a double page and do splitting them
	- [ ] Special more in depth speaking of UB Mannheim and Kaiserslautern how to do this 
- Frontend is being implemented (Lukas)

10:30 Further updates from
 - UB Mannheim
 - DFKI Kaiserslautern
 - HdM Stuttgart
 - ZBW Kiel

-> already covered above

11:30 Next steps
* [ ] special session DFKI, UB Mannheim for GT inputting
* [ ] feedback data model (scans etc.)
* [ ] full workflow circle with all steps (messy steps are okay for now): move from three protoypes to one workflow
	1. scan + upload, 
	2. enter PPN,
	3. ..., 
	4. align references in GUI
* [ ] further development of GUI
* [ ] Where to find the metadata for the articles in collections/book sections itself? - Manual cataloging for starting..

12:30 Lunch break :pizza: :tomato: (Novus)

13:30 LOC-DB Workshop
* 2 workshops, maybe also as part of some meeting/conference
* we need a fully working prototype
* developers (?), librarians, decision makers
* focus on prototype, or implications of LOC-DB data?
* ~ Oct 2017 (after one year of project) + ... -> data, place, flyer until May
* usability study during workshop (maybe also with eytracker)
* attract FID/SSG
* [ ] look for day where Fuchs-Petrolub-Saal + Dozentenzimmer is available
* [ ] continue...

14:00 Project website and communication
* News, e.g. workshop announcements
* [Die Gruppe](https://locdb.bib.uni-mannheim.de/blog/de/die-gruppe/) -> change to just one page with fotos and ~~short summaries and~~ just links to your personal homepage
* GitHub vs GitLab?
	* In the end we want Open Source open for everybody.
	* GitHub account github.com/locdb -> 
		* [x] Kai will do
		* [ ] send your github user name to kai
	* start with GitHub and see if we need anything more


14:30 Presentations and conferences
* SWIB17 December 4 - 6, 2017, in Hamburg
* ICDAR, related topics (social network analysis), mention project! maybe key note
* Bibliothekartag
* Dublin Core (Kai maybe there)
* Digital Libraries ICDL
* [WikiCite](https://meta.wikimedia.org/wiki/WikiCite_2017): May 22-25, 2017
* ~~Open Science conference 2017~~ rejected
* JCDL, different topic (Lukas), advertising LOC-DB, poster?

15:00 Summary and To Dos


15:15 Next meeting time, date, and location

Next meeting
* April, Tuesday would be best
* We will meet in Kaiserslautern
* **goal**: connect everything together + first prototype + librarians worked with it + ready for feedback after using it for some weeks
* Lukas suggest to do next meeting (in summer :sunny: ) in Kiel

Skype call additional
* Additional Skype sessions on the working level, decide when to do, and if more people should attend to a call
