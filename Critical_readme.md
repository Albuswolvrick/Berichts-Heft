# A Monument to Our Sins: The Report-inator

Welcome. You've stumbled upon what is generously called the "Online-Berichtsheft" project. If you're looking for a shining example of how to build a web application, turn back now. This is a case study in what happens when two "devs," P.M.H/Sindrie and Jack apfel, are left unsupervised with a text editor and a vague set of requirements. What was meant to be a simple digital reporting tool for apprentices has become a sprawling mess of half-baked ideas and technical debt.

## The Grand "Vision" vs. The Ugly Reality
According to some file I found (`mdfiles/ANLEITUNG.md`), this was supposed to be a straightforward tool. You log in, you write reports. Simple, right? Wrong. The reality is a labyrinth of questionable design choices, documented in such professional-grade planning files as `1. Layout.txt` which contains gems like planning to implement "sighn up" and "secure data conection". The entire planning process seems to have taken place in a folder ironically named `unrelated and Plans`.

## "Features" (and I use that term loosely)
*   **User Authentication:** It exists. We think. We were supposed to have "anti Brutforce mechanics" but I'm pretty sure a stiff breeze could knock this thing over.
*   **Report Management:** You can create reports. Can you edit them? Maybe. Can you download them? The plan said "make it downloadebl", but like many things in this project, plans are just dreams.
*   **Styling:** Oh, the styling. We have `style.css`, `new-report.css`, `login.css`, and for some godforsaken reason, `doom.css`. Yes, `doom.css`. I don't know what it does and I'm too afraid to look. It's like a CSS cage match in your browser every time you load a page. The `--report-header-color` is `#e06c75`, which is a disturbingly cheerful color for such a bleak project.

## The Technological Garbage Fire
*   **Frontend:** React and Vite. Modern tools for a primitive beast.
*   **Backend:** Node.js with Express. A classic choice, which we've managed to contort into a pretzel of spaghetti code.
*   **Database:** Prisma and SQLite. Just look at the `prisma/migrations` folder. We've had a "professional_schema_refactor", an "expanded_database", and a fix for a "typo_in_yearly_report". This isn't evolution; it's a series of frantic patch-jobs. And we have about three different `.db` files lying around (`dev.db`, `sessions.db`, `prisma/dev.db`). Which one is the real one? Your guess is as good as mine.

## How to Run This Abomination (At Your Own Peril)
The `ANLEITUNG.md` says this is how you do it. I'm not promising it'll work.
1.  `npm install`: Good luck with the dependency tree. It's probably haunted.
2.  `npx prisma db push`: This is supposed to set up the database. It might also summon a demon. Who knows.
3.  `npm run dev`: If the stars align and you've made the correct sacrifices, you might see something at `http://localhost:5173`. Don't come crying to me if your computer starts smoking.

## A Word on "Planning"
Our entire development strategy is laid bare in the `unrelated and Plans/` directory. It's a masterclass in how *not* to manage a project. It's a mix of misspelled text files ("nesecery information exchange") and PNGs of what the login screen *should* look like. It's a digital graveyard of good intentions.

## In Conclusion
This project is what it is. A monument to scope creep, poor planning, and the kind of blind optimism that only junior developers possess. If you're here to contribute, you're either a masochist or you're lost. Either way, welcome to the circus. Don't feed the developers. They bite.
