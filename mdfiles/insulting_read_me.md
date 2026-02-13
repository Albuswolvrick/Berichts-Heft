# BERICHST-HEFT

I have been awake for aproxematly 42 hours.

My headphones are out of fucking battery 14 minutes ago and now I can hear people breathing.and talking why the hell are they playing a game duaring work time those Idiotic Assholes.

This repository is the result.

---

## WHAT THIS PROJECT DOES

German Ausbildung requires a “Berichtsheft”.

Which means:
every week you must document that you existed at work.

Examples of required professional documentation:

* "Computer eingeschaltet"
* "E-Mail gelesen"
* "Mittagspause überlebt"
* "Nichts kaputt gemacht (glaube ich)"

This software exists because writing that in a notebook apparently was still too close to sanity.

---

## ARCHITECTURE

You would assume this needs:
a text field
and a save button.

Incorrect.

Instead:

* React
* Vite
* Node
* Express
* Prisma
* SQLite
* Sessions
* bcrypt
* Environment variables
* Two terminals
* A small ritual sacrifice

To store one paragraph per day.
and also have the option to do it monthly, weakly, and yearly. why the heck yearly good knows why but I hate every single Isue of this but you searched for this so your problem now Idiot.

Humanity created compilers and this is what we compile.

---

## WHY SQLITE

Because I do not want to install PostgreSQL.

Because I do not want Docker.

Because I do not want to talk to people in a forum about ports.

The database is a file.

If the file dies, the reports die.

Just like my motivation to not kill every one in the room.

---

## AUTHENTICATION

Yes, it has login.

Why does a diary need authentication?

Because schools require signatures.

Because bureaucracy fears the possibility that a human being might be trusted once.

Passwords are hashed with bcrypt.

Your weekly description of sweeping the floor is now cryptographically protected.

---

## ADMIN DASHBOARD

There is an admin panel.

A human being can log in
and review your weekly logs
to verify you worked.

The industrial revolution gave us automation and we automated supervision.

---

## SERVER.JS

Everything is in `server.js`.

Not because it is good.

Because at 02:47 refactoring felt like climbing a mountain made of knives.

At some point it had 10 critical issues.

Now it has fewer visible ones.

That is the closest software ever gets to “fixed”.

 you want to change my shit you are welcome to try. pls do 

---

## INSTALL

If you really want to run this:

```
git clone https://github.com/Albuswolvrick/Berichts-Heft
cd Berichts-Heft
npm install
cp .env.example .env
npm run prisma:push
npm run server:dev
npm run client:dev
```

If it works first try, you are blessed by unknown forces.

If not:
that is the normal developer experience.

---

## PERFORMANCE

You need:

* Node running
* React dev server running
* database running

to replace paper.

Paper never required dependency resolution.

Paper never threw “port already in use”.

Paper is also lost every time you try to show it so fuck this is a valid thing for some asholes.

Paper never broke because a package maintainer deleted a library at 3am in another timezone.

---

## PROBLEMS

JavaScript has:

* async problems
* state problems
* type problems
* time problems
* existence problems

You press save.

Nothing happens.

You refresh.

It worked.

This is called web development.

---

## SECURITY

Sessions.
Cookies.
Secrets in `.env`.

The actual sensitive data:

"Tuesday: sorted cables"

is now defended by cryptography stronger than early banking systems.

---

## CONTRIBUTING

If you understand this code,
you are already more qualified than I was when I wrote it.

Pull requests welcome.

Psychological stability not required.

Insanaty is requiered so any dev works.

---

## FINAL WORDS

This project is not overengineered because I wanted it to be.

It is overengineered because modern software development cannot solve a simple problem simply anymore.

I wanted a notebook.

I built a web service.

I do not feel victory.
I feel completion.

The people in the fucking room are still talking.

The app runs.

That is enough. (I think)
