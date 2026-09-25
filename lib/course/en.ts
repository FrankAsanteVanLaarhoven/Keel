import type { Pack } from "./types";

export const en: Pack = {
  sections: {
    tools: {
      title: "The workbench",
      promise: "Know what each tool is for, and which environment the work actually lives in.",
      objectives: [
        "Name the editor, the browser, the terminal, and the history.",
        "Tell a personal laptop from a shared environment.",
        "Ask four plain questions before you trust a new tool.",
      ],
      start: [
        "A tool helps you make a change and then see what happened. The editor is where the work is written. The browser is where a person tries it. The terminal is a plain window where you ask the machine to run a check. Each window has a job. Once those jobs are distinct, the work is easier to share.",
        "An environment is the place those tools run. Your own laptop is one environment. A front desk at a clinic is another. A shared machine in a data centre is a third. The work can move. The promise to the person using the system must not.",
      ],
      how: [
        "Version history remembers every saved change, who made it, and a sentence about why. Two people can work without erasing each other. A package list writes down the exact outside pieces you used, so tomorrow's build can match today's. A log or a debugger lets you watch one action instead of guessing.",
        "When you meet a new tool, ignore the colour of the window and ask: Can two people use it without overwriting each other? Does it run the same on a second machine? Can you undo? Does a failure show up in words a person can read? If the answer is no, it is a sketch, not a workbench.",
      ],
      expert: [
        "Teams standardise the workbench. A new person should open the project and run the checks on the first morning. That means the setup is written down, secrets are not stored in the project, and the checks do not depend on one private screen.",
        "The expensive failure is a system that only runs on the machine of the person who left. Fashion in editors changes. The job does not: repeat the work, recover yesterday, and explain a failure.",
      ],
      example: [
        "Harbor Market keeps the public board and the stall book in one shared project. A stallholder never opens the editor. Staff do. The project runs on a managed environment, not on a laptop that goes home at night.",
        "If that laptop were the only copy, a spilled drink would close the market's records. The history, not the brand of editor, is what keeps Tuesday recoverable.",
      ],
      narration:
        "A tool helps you make a change and see what happened. The editor is where the work is written. The browser is where a person tries it. The terminal is where you ask the machine to run a check. The history remembers every saved change, so two people cannot erase each other. Harbor Market keeps that history on a shared workbench, not on one laptop that goes home at night.",
      checkPrompt: "Which feature lets two people change the work without silently erasing each other?",
      checkOptions: ["A brighter colour theme", "A history of every saved change", "A larger monitor", "A faster mouse"],
      benchTitle: "Put the morning in order",
      benchPrompt: "A new staff member is about to change the opening hours. Put the steps in the order you would trust.",
      benchItems: [
        "Name the job in one sentence.",
        "Open the shared workbench, not a private copy.",
        "Make one small change.",
        "Save it in the history, with a sentence about why.",
        "Show it to a colleague before it goes any further.",
      ],
      benchSlots: [],
      caseOrg: "Riverside Clinic",
      caseFile: "RC-01",
      caseTitle: "The front desk and the only laptop",
      caseSituation: [
        "Riverside Clinic lets patients book a nurse by phone or at the desk. The booking change lives on one laptop that only the receptionist knows how to open. When that person is off, the desk writes times on paper and types them in later.",
        "The clinic is not a software company. The people at the desk are not developers. They still need a workbench that another trained person can open on a Monday.",
      ],
      caseTask: "Choose where this work should live, and what must happen when a check fails.",
      caseSteps: [
        "Read the two environments: one private laptop, or a shared clinic workbench with a history.",
        "Picture a Monday when the receptionist is away and a patient needs to move a time.",
        "Answer the three decisions in ordinary words.",
        "In the note, say what the desk person does first, and what they never do with the only copy.",
      ],
      decisions: [
        {
          prompt: "Where should the booking work live?",
          options: ["On the receptionist's personal laptop", "On a shared clinic workbench any trained person can open", "On paper only"],
        },
        {
          prompt: "What remembers the changes?",
          options: ["Whoever was on the desk that day", "A history of every saved change", "Nothing, if people are careful"],
        },
        {
          prompt: "A check fails before the change reaches the desk. What do you do?",
          options: ["Put it on the desk anyway", "Stop, and do not put it on the desk", "Hide the failure so the morning stays calm"],
        },
      ],
      noteLabel: "Your note to the clinic manager",
      noteHint: "Write what the desk should open, and what must never be the only copy.",
    },
    platforms: {
      title: "Platforms",
      promise: "See what changes between a phone, a desk, and a kiosk, and what must stay the same.",
      objectives: [
        "Say what a platform is in one sentence.",
        "Separate the screen from the record.",
        "Compare two platforms without being fooled by fashion.",
      ],
      start: [
        "A platform is the place a person meets the system: a phone, a desk computer, a kiosk, a tablet in a corridor. The screen changes. The job often does not. A rider wants to know if the bus is coming. An inspector wants to know if a pass is valid. The night desk wants the same truth, on a larger screen, with a keyboard.",
        "People who are not developers still have to finish a task. If the platform makes the task harder, the platform is wrong, even when it looks new.",
      ],
      how: [
        "What usually stays the same: who the person is, what they are allowed to do, the record of what happened, and the promise that the record is true. What usually changes: the size of the screen, whether there is a keyboard, whether the network drops, and how fast the person must act.",
        "A useful comparison is a table with three rows. The job. What must be true. What the platform makes easy or hard. If two platforms cannot share one record, you do not have two doors. You have two systems that will disagree.",
      ],
      expert: [
        "Teams get into trouble when each platform grows its own copy of the rules. The phone says the pass is valid. The inspector's device says it is not. The night desk cannot tell which one to believe. The fix is one record and one place the decision is made, with thin doors in front.",
        "Offline matters. A kiosk in a station may lose the network. Decide, before you build, which actions must wait and which may be stored and sent later. Write that down. It is part of the platform choice, not a surprise.",
      ],
      example: [
        "Harbor Market has three doors onto one stall book. Shoppers use a phone page to see what is open. Stallholders use a simple phone page to mark themselves open or closed. The office uses a desk screen with a keyboard for the full day.",
        "The pages look different. The record is the same stall, the same hours, the same person allowed to change them. A second private spreadsheet would make the board lie.",
      ],
      narration:
        "A platform is where a person meets the system. The screen can change. The record should not. At Harbor Market the shopper, the stallholder, and the office each get a different door. They all read and write one stall book. If each door kept its own copy, the board would lie.",
      checkPrompt: "What should stay the same when you move a job from a phone to a desk?",
      checkOptions: ["The colour of the buttons", "The record and the rules", "The animations", "The slogan"],
      benchTitle: "Three jobs, three doors",
      benchPrompt: "City Hopper runs a transit pass. Match each job to the door that fits it. The record of the pass stays one record.",
      benchItems: ["A phone in the rider's hand", "A small handheld for the inspector on the vehicle", "A desk screen for the night operations team"],
      benchSlots: ["The rider, checking a pass", "The inspector, on a moving bus", "The night team, with a keyboard and a long shift"],
      caseOrg: "City Hopper",
      caseFile: "CH-02",
      caseTitle: "One pass, three doors",
      caseSituation: [
        "City Hopper wants riders, inspectors, and the night desk to trust the same pass. A vendor has offered three separate apps, each with its own database, because that is faster to demo.",
        "The people using them are not developers. A rider is in a hurry. An inspector is standing in an aisle. The night desk has time, a keyboard, and the job of fixing mistakes.",
      ],
      caseTask: "Choose the doors, and refuse a design that lets the three apps disagree.",
      caseSteps: [
        "List the three jobs and where each person is standing.",
        "Mark what must be identical: the pass, whether it is valid, and who may change it.",
        "Answer the decisions.",
        "In the note, say which door is thin, and why a second copy of the pass would be a failure.",
      ],
      decisions: [
        {
          prompt: "Where should a rider meet the pass?",
          options: ["A paper card only", "A phone page", "They must come to the office"],
        },
        {
          prompt: "What stays the same across the doors?",
          options: ["The colour of each app", "The record of the pass and the rules", "The slogan on the splash screen"],
        },
        {
          prompt: "The vendor offers three apps with three databases. What do you do?",
          options: ["Accept them, so the demo is quick", "Insist on one record behind the doors", "Build nothing until next year"],
        },
      ],
      noteLabel: "Your note to the transit lead",
      noteHint: "Name the three doors and the one record they must share.",
    },
    design: {
      title: "Design for people",
      promise: "Start from the task a tired person is trying to finish, not from the screen you want to draw.",
      objectives: [
        "Describe a task before you describe a screen.",
        "Write an error that tells a person what to do next.",
        "Notice when a design only works for someone who is rested and expert.",
      ],
      start: [
        "Design here means the shape of the task, not a coat of paint. A person arrives with a job: renew a benefit, book a nurse, see if a stall is open. They may be new, tired, in a hurry, or using a keyboard only. The system should help them finish.",
        "If you start from colours, logos, or the shape of the database, you will build something that makes sense to the makers and not to the person. Ask what they are trying to do, in their words, before you ask what the screen looks like.",
      ],
      how: [
        "Write the task as steps a person can say out loud. One step asks for one thing. Each step has a way back. An empty screen says what to do, not only that there is nothing there. An error says what went wrong and the next action, in plain words, without a code number as the only clue.",
        "Then try the steps as three people: someone new, someone tired at the end of a shift, and someone who does not use a mouse. If one of them gets stuck, the design is not finished. Read the words aloud. If you would not say them to a person at a desk, do not put them on the screen.",
      ],
      expert: [
        "Requirements are the promises: what must be true when the person is done, what must never happen, and what can wait. A client-facing page and the staff page behind it can look different and still serve one promise. Staff need speed and completeness. The public page needs calm and a short path.",
        "Good design leaves a trail. When a task fails halfway, the person should not lose the work, and a colleague should be able to see where it stopped. That is design for operations, not decoration.",
      ],
      example: [
        "Harbor Market's public question is small: what is open tonight? The first screen answers that, with the stall name and the hours. It does not begin with an account, a map of the database, or twelve filters.",
        "A stallholder marking themselves closed gets one question and a clear saved line. If the network drops, the page says the change is not saved yet, and what to do. It does not show a raw error code.",
      ],
      narration:
        "Start from the task, not the screen. Ask what the person is trying to finish, in their words. One step should ask for one thing. An error should say what to do next. At Harbor Market the public question is simple: what is open tonight? The first screen answers that, before it asks for anything else.",
      checkPrompt: "What do you design first?",
      checkOptions: ["The colour palette", "The task the person is trying to finish", "The logo", "The shape of the database"],
      benchTitle: "A form for a tired person",
      benchPrompt: "Civic Benefits renewal currently asks twelve questions on one screen. Choose the version a tired person can finish.",
      benchItems: [
        "Keep all twelve fields on one screen so it looks complete.",
        "Ask one question at a time, with a way back, and save as they go.",
        "Replace the words with pictures and remove the questions.",
      ],
      benchSlots: [],
      caseOrg: "Civic Benefits",
      caseFile: "CB-03",
      caseTitle: "The twelve-field renewal",
      caseSituation: [
        "People renew a benefit once a year. The current form has twelve fields, two of which are codes the office understands and the resident does not. If they get one wrong, the page says 'Error 422' and clears the form.",
        "The residents are not developers. Many are on a phone. Some use a keyboard only. The office wants fewer half-finished renewals, not a prettier logo.",
      ],
      caseTask: "Rewrite the path so a person can finish it, including when they make a mistake.",
      caseSteps: [
        "Say the resident's task in one sentence, in their words.",
        "Cut the path into steps that ask for one thing.",
        "Decide how an error speaks, and how someone without a mouse still finishes.",
        "In the note, write the first three steps as the resident would see them.",
      ],
      decisions: [
        {
          prompt: "What do you settle before the screen?",
          options: ["The colour of the header", "The task in the resident's words", "The logo lockup"],
        },
        {
          prompt: "The renewal fails a check. What does the page say?",
          options: ["Error 422, and the form is cleared", "What went wrong, and the next thing to do, with their answers kept", "A blank page"],
        },
        {
          prompt: "Who must be able to finish?",
          options: ["Only people who use a mouse", "A person with a keyboard only, including someone new or tired", "Only people who print the form"],
        },
      ],
      noteLabel: "The first three steps, in the resident's words",
      noteHint: "Write the steps a person would actually see, including what an error says.",
    },
    tiers: {
      title: "Three rooms",
      promise: "Separate what the person sees, what decides, and what remembers.",
      objectives: [
        "Name the browser, the application, and the database in plain words.",
        "Follow one request from a tap to a saved record.",
        "Say what 'it has to keep working on a Tuesday night' asks of each room.",
      ],
      start: [
        "Most systems that face a person, and also keep records, are arranged in rooms. The first room is what the person sees, often a browser. The second room decides: it checks who they are and applies the rules. The third room remembers: the database, and sometimes a cache of answers you can afford to repeat.",
        "You can draw this for a clinic, a market, or a game. The names stay useful. Mixing the rooms is how a system becomes something only its author can hold in their head.",
      ],
      how: [
        "A request travels. The person taps 'closed for tonight'. The browser sends that wish to the application. The application checks that this person may change this stall, then asks the database to remember it. The database writes the row. The application tells the browser, which shows a calm 'saved'.",
        "Operational means it still does this on a Tuesday night, when the author is asleep. Each room needs a job it can be watched for. The browser should not be the only place a rule lives, because a person can change their own browser. The database should not invent policy. It should store what the application asked, safely.",
      ],
      expert: [
        "Caches and queues are extra rooms you add when you know why. A cache remembers an answer that is allowed to be a few seconds old, such as a public list of open stalls. It must not be the only memory of a payment. A queue holds work that can wait a moment, so a spike does not knock over the room that decides.",
        "Draw the rooms before you name products. Products change. The question does not: where is this decision made, where is it remembered, and what happens when one room is down? If you cannot point to the room, you cannot operate the system.",
      ],
      example: [
        "At Harbor Market the public board is the browser room. The application room decides whether this stallholder may edit this stall. The database room remembers the hours. A cache may hold the public list for a few seconds. It does not hold the only copy of a change.",
        "If the application is down, the board should say so, not invent hours. If the database is down, the application should refuse the write and say it was not saved. Silence would look like success.",
      ],
      narration:
        "Picture three rooms. The browser is what a person sees. The application decides, including who is allowed to act. The database remembers. A tap travels from the first room to the second, and then to the third. At Harbor Market the public board must not invent hours if the deciding room is down. A saved change has to reach the room that remembers.",
      checkPrompt: "Where should the decision 'may this person change this stall?' live?",
      checkOptions: ["Only in the browser", "In the application, where the rules run", "Only in the database", "On a paper poster"],
      benchTitle: "Label the rooms",
      benchPrompt: "Match each sentence to the room that should own it.",
      benchItems: ["The browser, what the person sees", "The application, which applies the rules", "The database, which remembers"],
      benchSlots: ["Show the list of open stalls", "Decide whether this person may edit this stall", "Remember the hours after the person has gone"],
      caseOrg: "Harbor Market",
      caseFile: "HM-04",
      caseTitle: "The stall book and the public board",
      caseSituation: [
        "Harbor Market wants a public board of who is open, and a way for stallholders to update their own hours from a phone. The market office is small. Nobody there writes software. They do need the board to be true on a Saturday night.",
        "A friend of the market offers to 'put it all in the page', rules included, because that is fewer pieces to host.",
      ],
      caseTask: "Name the three rooms and refuse a design that hides the rules only in the browser.",
      caseSteps: [
        "Draw three boxes: what people see, what decides, what remembers.",
        "Put the public board, the 'may edit' rule, and the hours into those boxes.",
        "Say what the board should do if the deciding room is down.",
        "In the note, explain the path of one change, from a thumb on a phone to a row that is still there in the morning.",
      ],
      decisions: [
        {
          prompt: "Where does 'may this stallholder edit this stall?' live?",
          options: ["Only in the phone page", "In the application, with the other rules", "On a poster in the office"],
        },
        {
          prompt: "Where are the hours remembered?",
          options: ["Only in the browser until it is closed", "In the application, in memory, until a restart", "In the database"],
        },
        {
          prompt: "What does the public board do while the deciding room is down?",
          options: ["Say that the live board is unavailable", "Invent hours so the page is not empty", "Ask shoppers to edit the stalls themselves"],
        },
      ],
      noteLabel: "The path of one change",
      noteHint: "Follow a stallholder closing for the night, from the phone to the record that is still there in the morning.",
    },
    integration: {
      title: "The checklist that runs",
      promise: "Let a machine repeat the checks every time, and stop when they fail.",
      objectives: [
        "Explain what continuous integration does, in words a colleague can reuse.",
        "Name what a pipeline checks before people may share a change.",
        "Say what a red result means on a night that matters.",
      ],
      start: [
        "Continuous integration means the team puts changes together often, and a checklist runs by itself each time. The checklist repeats the same checks every time, so a busy evening and a quiet morning get the same result. It builds the work, runs the tests, and sometimes looks for secrets that should not be in the files. People still read the result. The machine does the repetition.",
        "Without this, the first time you discover a broken change is in front of a person who needed the system. With it, you discover the break while the change is still small.",
      ],
      how: [
        "A pipeline is that checklist written so a machine can run it. A typical order: someone makes a change, the checklist runs, a second person looks, and only then does the change join the shared line. If the checklist fails, the change does not join. The screen shows red. Red means not yet: the change stays off the shared line until the checklist passes.",
        "What you put on the list depends on the promise. A results portal cares that marks add up and that a student cannot see another student's marks. A market cares that a stall cannot be edited by a stranger. Write the promises as checks. A checklist that only checks the colour of a button is theatre.",
      ],
      expert: [
        "The pipeline should be the same on a developer's morning and on the night before a public day. If people can skip it when they are in a hurry, the hurry is when it was needed. Protect the skip. Make it rare, named, and written down.",
        "Logs of the checklist are not a diary for secrets. Passwords, keys, and personal records do not belong in the output. A green build that printed a secret is a failure, even though it is green.",
      ],
      example: [
        "Harbor Market's checklist runs when a staff change is offered. It checks that the project still builds, that a stranger cannot edit a stall, and that the public board still answers 'what is open?'. Then a second person looks.",
        "On the morning of a festival, a red checklist stops the change. The market opens on yesterday's known-good version. That is the point of the machine: it is willing to be unpopular.",
      ],
      narration:
        "Continuous integration means a checklist runs every time the work changes. The machine builds, checks, and stops if something the promise cares about has failed. Red means not yet. At Harbor Market a red checklist on a festival morning keeps yesterday's working version in front of shoppers.",
      checkPrompt: "A checklist result is red. What does that mean?",
      checkOptions: [
        "Ship it, the colour is only a warning decoration",
        "Do not continue. Something the checklist cares about has failed",
        "Ignore it if the change is small",
        "Celebrate, red means ready",
      ],
      benchTitle: "Order the pipeline",
      benchPrompt: "Put these steps in the order that keeps a bad change out of the shared line.",
      benchItems: [
        "Someone makes a change.",
        "The checklist runs by itself.",
        "A second person looks.",
        "The change joins the shared line.",
      ],
      benchSlots: [],
      caseOrg: "North School",
      caseFile: "NS-05",
      caseTitle: "The night before results day",
      caseSituation: [
        "North School publishes results in the morning. The portal shows each student their own marks. A well-meant change to the layout is offered at 21:00 the night before. The author is sure it is tiny.",
        "Parents and students are not developers. A wrong total, or one student seeing another's marks, is not a small cosmetic issue.",
      ],
      caseTask: "Design the checklist for that night, including who may let a change through.",
      caseSteps: [
        "Write the promises the checklist must protect: totals, and privacy.",
        "Put the steps in order, including a second person.",
        "Decide what happens when the checklist is red at 21:00.",
        "In the note, say what the morning uses if the change is not ready.",
      ],
      decisions: [
        {
          prompt: "The checklist is red at 21:00. What happens to the change?",
          options: ["It goes out, because results morning cannot wait", "It is blocked. Morning uses the last version that passed", "The checks are skipped, just this once"],
        },
        {
          prompt: "Who may let a change join the shared line?",
          options: ["Only the author", "The author and a second person, after the checklist is green", "Nobody, changes are copied by hand"],
        },
        {
          prompt: "A check prints a database password in its log. What is that?",
          options: ["Useful, so the next person can log in", "A failure. Secrets do not belong in the log", "Something to email to the whole staff list"],
        },
      ],
      noteLabel: "What results morning uses",
      noteHint: "Say what runs in the morning if the night change is red, and which promises the checklist guards.",
    },
    deployment: {
      title: "Releasing carefully",
      promise: "Put a change in front of people in a small step, with a way back.",
      objectives: [
        "Tell a trial run from the real system.",
        "Plan a release that can be undone.",
        "Say who must hear what changed.",
      ],
      start: [
        "Deployment means taking a change from the workbench to a place real people use. There is usually a private place to try it, a trial place that looks like the real one, and the real system. The real system is the one a person trusts on a Tuesday night.",
        "A release is the moment the change crosses into that real place. Big releases feel brave and fail loudly. Small releases, with a way back, feel quiet and are how careful teams work.",
      ],
      how: [
        "A way back means you can return to the previous version without reconstructing it from memory. You practised it. You know how long it takes. You know what happens to work people did during the new version, if any.",
        "Tell the people who will meet the change. Nurses, desk staff, stallholders. They do not need a technical diary. They need: what changed, what to do if it looks wrong, and who to call. A silent release is how a night shift loses trust.",
      ],
      expert: [
        "Feature flags let you turn a change on for a few people first. They are useful and they are also a room you must tidy. A flag left on for a year is a second system hiding inside the first. Name an owner and a date to remove it.",
        "Never release only because the calendar says so. Friday afternoon, the night before results, the hour the market opens: these are when a way back matters most. If you cannot roll back, you are not ready, however green the checklist was.",
      ],
      example: [
        "Harbor Market turns on a new 'closing soon' line for one row of stalls first. The office watches the board for an hour. The way back is a switch to yesterday's board, already rehearsed.",
        "Stallholders hear about it in the morning note: what they will see, and that hours are unchanged. The release is not a surprise dropped at opening time.",
      ],
      narration:
        "Deployment is the moment a change reaches people who are not its makers. Keep a private place, a trial place, and the real system. Release in a small step, and keep a way back you have actually tried. Tell the people on the shift what changed and who to call. A silent release is how trust gets lost.",
      checkPrompt: "What must you have before a change reaches the real system?",
      checkOptions: ["A Friday afternoon, so there is weekend time", "A way back to the previous version", "The largest possible change, so you only do it once", "Silence, so nobody worries"],
      benchTitle: "Choose the release",
      benchPrompt: "St Brigid's wants a new way for nurses to swap a shift. Which release do you trust?",
      benchItems: [
        "Replace the whole roster on Monday at the start of the shift, with no way back.",
        "Turn the new swap on for one ward, and keep a rehearsed return to the old roster.",
        "Turn it on for everyone at midnight and tell nobody.",
      ],
      benchSlots: [],
      caseOrg: "St Brigid's Hospital",
      caseFile: "SB-06",
      caseTitle: "The ward roster",
      caseSituation: [
        "Nurses at St Brigid's swap shifts through a roster. A new swap button has passed its checks. The ward is full. The people using the roster are tired and they are not developers.",
        "If the new button strands a shift with no nurse, the way back matters more than the button.",
      ],
      caseTask: "Plan the release: how big, how you return, and who you tell.",
      caseSteps: [
        "Name the real system and who is standing in front of it.",
        "Choose a small first step, not the whole hospital at once.",
        "Write the way back in a sentence a night coordinator can follow.",
        "In the note, draft the message the ward will actually read.",
      ],
      decisions: [
        {
          prompt: "How big is the first release?",
          options: ["Every ward, Monday morning", "One ward, with the rest unchanged", "A secret release, so there is no fuss"],
        },
        {
          prompt: "Is there a way back?",
          options: ["No. Going back would take a week of reconstruction", "Yes. It is rehearsed and a person on the night can start it", "We will hope we do not need one"],
        },
        {
          prompt: "Who hears what changed?",
          options: ["Nobody, to avoid questions", "The nurses and the coordinator, in plain words, with a name to call", "Only a poster in the car park"],
        },
      ],
      noteLabel: "The note the ward will read",
      noteHint: "Say what changed, what to do if it looks wrong, and who to call.",
    },
    maintain: {
      title: "The next person",
      promise: "Leave the system so someone who arrives in six months can change one thing safely.",
      objectives: [
        "Explain maintainability as care for the next person.",
        "Separate a small change from the dangerous core.",
        "Name an owner for the part that pages someone at night.",
      ],
      start: [
        "Maintainable means a person who did not build the system can still change it without breaking the promise. That person might be you, in six months, after you have forgotten the clever part. They might be a new colleague. They might be a volunteer at a charity.",
        "If every change requires the original author, the system is already failing, even while it looks fine today.",
      ],
      how: [
        "Names should say what a thing is for. Pieces should be small enough to hold in mind. A map, written down, says where a change goes: the thank-you letter is here, the payment is there, and they meet at one door. The next person changes the letter without opening the payment.",
        "Ownership is part of the map. When the payment fails at night, a named role gets the call, not 'whoever is around'. The map includes how to run the checks, where the history is, and what must never be improvised.",
      ],
      expert: [
        "Cleverness that only the author can read is a cost, not a gift. Prefer a structure a new colleague can trace. Comments explain why, not what the next line already says. Dead flags, unused doors, and copies of the same rule in three places are maintenance debt.",
        "A system for non-developers needs maintainers who can refuse a tangle. 'Can a new person change the letter safely?' is a release question, not a nice-to-have.",
      ],
      example: [
        "Harbor Market writes a one-page map. Opening hours are one piece. Who may edit a stall is another. Payments for power and water, if they are added later, stay apart from the public words on the board.",
        "A new Saturday staff member can change a holiday closing from the map, run the checklist, and ask the named owner if the rule about who may edit is involved. They do not hunt through a single undifferentiated pile.",
      ],
      narration:
        "Maintainable means the next person can change one thing safely. That person might be you, in six months. Leave a map. Keep the thank-you letter apart from the payment. Name who gets the call at night. At Harbor Market a new Saturday staff member can change a holiday closing without touching the rule about who may edit a stall.",
      checkPrompt: "Which sentence best describes a maintainable system?",
      checkOptions: [
        "It is clever, and only the author can change it",
        "A new person can find the piece and change it without breaking the rest",
        "It always uses the newest fashion",
        "It is the longest file, so everything is in one place",
      ],
      benchTitle: "The thank-you letter",
      benchPrompt: "Kindling is a small charity. The donation page and the thank-you letter live in one tangle. A volunteer needs to change the letter. What do you choose?",
      benchItems: [
        "Leave the letter inside the payment code so nothing gets out of sync.",
        "Split the letter from the payment, with one door between them, and a short map.",
        "Rewrite the whole charity site before the letter may change.",
      ],
      benchSlots: [],
      caseOrg: "Kindling",
      caseFile: "KL-07",
      caseTitle: "The tangled donation page",
      caseSituation: [
        "Kindling's website takes donations and sends a thank-you letter. Both grew in one pile of files. A volunteer who is not a developer wants to change the letter for winter. Last time someone tried, card payments failed for an afternoon.",
        "The charity cannot hire a large team. It can leave a map and a boundary.",
      ],
      caseTask: "Propose a split so the letter can change without risking the payment.",
      caseSteps: [
        "Name the two jobs: warm words, and taking money safely.",
        "Put a boundary between them.",
        "Name who gets the call if payments fail.",
        "In the note, write the map in a few lines a volunteer can follow.",
      ],
      decisions: [
        {
          prompt: "Where should the thank-you letter live?",
          options: ["Inside the payment code", "Apart from the payment, meeting it at one door", "Frozen, so nobody can change the words"],
        },
        {
          prompt: "Who is called if payments fail at night?",
          options: ["Whoever happens to see it", "A named role, written on the map", "The whole volunteer chat, all at once"],
        },
        {
          prompt: "Where does the map live?",
          options: ["In the original author's memory", "Written down, next to how to run the checks", "In a private chat that disappears"],
        },
      ],
      noteLabel: "The map for a new volunteer",
      noteHint: "Show where the letter is, where the payment is, and who to call.",
    },
    scale: {
      title: "When the line gets long",
      promise: "Grow the number of people without breaking the thing that must stay exact.",
      objectives: [
        "Tell a busy moment from a design that is simply wasteful.",
        "Explain a queue and a cache without hiding the trade.",
        "Protect correctness and fairness while you grow.",
      ],
      start: [
        "Scale is what happens when more people arrive than the current shape can hold. Ten people in a clinic is not a million people buying a ticket at the same second. Both are real. The first does not need the machinery of the second. The second will fall over if you pretend it is the first.",
        "The thing that must stay true does not get to be approximate. A person is charged once. A seat is sold once. A pass is valid or it is not. Pretty pages can wait. The exact record cannot.",
      ],
      how: [
        "When a crowd arrives, they form a line. A queue is that line for work. It feels slower to each person and it keeps the deciding room from being knocked over. A cache repeats a public answer that may be a few seconds old, so the database is not asked the same question a million times. A copy of a service can share read-only work. Copies do not forgive a rule that was only true on one machine.",
        "Fairness is part of scale. A person with a faster connection should not be able to cut a queue you promised was fair. Write down what 'fair' means before the crowd arrives, not during it.",
      ],
      expert: [
        "The order of operations is: measure the actual pain, protect the exact record, then add a queue or a cache for the part that can bend. Do not cache a payment. Do not let the public page hammer the row that must be exact. Do not buy a larger machine as the only idea, or you will buy it again next year.",
        "Millions of concurrent people is a specific promise. It needs a number, a rehearsal, and a plan for the minute the number is exceeded. 'It will be fine' is not an architecture.",
      ],
      example: [
        "Harbor Market's ordinary Saturday does not need festival machinery. Festival night does. The public board may be a few seconds stale. The act of marking a stall closed, and any payment, stays exact and goes through a line if the crowd is large.",
        "Shoppers may see 'open' for a moment after a stall closes. They must never be charged twice, and two people must never be told they hold the same last portion if the market sells numbered tickets.",
      ],
      narration:
        "Scale means more people than the current shape can hold. Ten people and a million people are different problems. What must stay exact, stays exact: a person is charged once, a seat is sold once. A queue is a line that protects the deciding room. A cache may repeat a public answer for a few seconds. It must not remember a payment. At Harbor Market the board may be briefly stale. The money may not.",
      checkPrompt: "While a system grows, what must stay true?",
      checkOptions: ["The pages get prettier", "The exact promises, such as charging a person once", "The brand gets louder", "The tools are the newest"],
      benchTitle: "Festival night",
      benchPrompt: "A million people will try to buy a Lantern Festival ticket at 10:00. What do you protect first?",
      benchItems: [
        "A bigger logo and a faster animation.",
        "The exact record: one ticket, one sale, no double charge. Let the public page wait in a line.",
        "A prettier gallery of last year's lanterns.",
      ],
      benchSlots: [],
      caseOrg: "Lantern Festival",
      caseFile: "LF-08",
      caseTitle: "Tickets at 10:00",
      caseSituation: [
        "The Lantern Festival sells a limited number of tickets. Last year the page froze at 10:00 and some people were charged twice. The audience is the public, not a technical team. They will tap again if the page looks stuck.",
        "You have ordinary days, and you have this minute. They should not be designed as the same minute.",
      ],
      caseTask: "Say what you protect first, what may wait in a line, and what you will not cache.",
      caseSteps: [
        "Name the exact promise: one ticket, one charge.",
        "Say what the person sees while they wait, so they do not tap twice in panic.",
        "Decide what may be cached and what must not.",
        "In the note, write the order of actions for that minute.",
      ],
      decisions: [
        {
          prompt: "What do you protect first?",
          options: ["A prettier page", "One ticket and one charge, exactly", "A new brand film"],
        },
        {
          prompt: "How does the crowd meet the selling room?",
          options: ["Every tap hits the payment row immediately, as hard as it can", "A queue, with a clear waiting state", "Close the site and sell only by post"],
        },
        {
          prompt: "What may be cached?",
          options: ["The payment itself", "A public hint, such as whether tickets are still available, a few seconds old", "Nothing, including the static pictures"],
        },
      ],
      noteLabel: "The minute of 10:00",
      noteHint: "Write the order: what stays exact, what waits, and what the person sees.",
    },
    observe: {
      title: "Seeing the system",
      promise: "Know which questions to ask when something looks wrong, and which alerts a person can act on.",
      objectives: [
        "Separate a log, a metric, and a trace in plain words.",
        "Follow one request from the door to the record.",
        "Write an alert that tells a human what to do.",
      ],
      start: [
        "Observability means you can tell what the system is doing without guessing. When a person says 'the board is wrong', you need a way to look that does not depend on the original author being awake.",
        "Three questions cover most nights. What did this one request do? How many are failing? What did the system write down at the time?",
      ],
      how: [
        "A log is a diary line: at this time, this stall was marked closed, by this kind of actor. It must not contain secrets or a person's private record beyond what the night requires. A metric is a number over time: how many board loads failed in five minutes. A trace is the path of one request through the rooms, so you can see where it stopped.",
        "An alert is a metric with a promise attached: if this number crosses a line, a named person should do a named thing. An alert that nobody can act on is noise, and noise teaches people to ignore the real one.",
      ],
      expert: [
        "Decide the questions before the outage. On a quiet afternoon, write: if deliveries stop showing as out for delivery, which trace do I open, which number do I trust, which log do I read? If you invent the questions at 02:14, you will miss the room that actually failed.",
        "Health is a sentence, not a green dot. 'Healthy' means the public board matches the database within a few seconds, and failed saves are visible. A green dot that hides a stuck queue is how a night is lost politely.",
      ],
      example: [
        "Harbor Market watches three things. The count of failed saves. The age of the public cache. And, when a stallholder says 'it did not save', the path of that one request.",
        "The alert is: if failed saves rise, wake the named owner and stop further releases. It does not page them because a picture loaded slowly.",
      ],
      narration:
        "You cannot fix what you cannot see. A log is a diary line. A metric is a number over time. A trace is the path of one request. An alert should name the action a person takes. At Harbor Market, if saves start failing, a named owner is woken and releases stop. A slow picture does not page anyone.",
      checkPrompt: "A stallholder says the change did not save. What do you want first?",
      checkOptions: [
        "Hope it was a one-off",
        "The path of that one request",
        "A new colour on the status dot",
        "A reboot, before looking",
      ],
      benchTitle: "Match the question",
      benchPrompt: "Parcel & Pine, 02:14. Deliveries have stopped showing as out for delivery. Match each need to the tool.",
      benchItems: ["A trace, the path of one request", "A metric, a number over time", "A log, the diary of what was written"],
      benchSlots: [
        "Follow one parcel's update through the rooms",
        "See how many updates are failing",
        "Read what the system wrote when a driver marked a parcel",
      ],
      caseOrg: "Parcel & Pine",
      caseFile: "PP-09",
      caseTitle: "02:14, the status goes quiet",
      caseSituation: [
        "Parcel & Pine shows customers a status: packed, out for delivery, delivered. At 02:14 the 'out for delivery' updates stop. Drivers are still working. Customers refresh and see nothing new. The night operator is not a developer.",
        "You are writing the questions they should be able to ask, and the alert that should have woken someone.",
      ],
      caseTask: "Say what you look at, what the alert says, and what is not worth paging a human for.",
      caseSteps: [
        "Write the three questions: one parcel, how many, what was written.",
        "Name the first look: the path of one update.",
        "Write the alert as an action, not a mood.",
        "In the note, define 'healthy' in a sentence the operator can check.",
      ],
      decisions: [
        {
          prompt: "What is the first look?",
          options: ["Reboot everything", "The path of one update that should have been shown", "Wait until morning in case it heals"],
        },
        {
          prompt: "What does a good alert say?",
          options: ["Something feels odd", "Failed updates crossed the line. Do this, and call this role", "Email the entire company"],
        },
        {
          prompt: "A single product photo loads slowly. Do you page the night operator?",
          options: ["Yes, page on every slow picture", "No. Page on the failed status updates, not on a slow picture", "Page them all night, so they stay alert"],
        },
      ],
      noteLabel: "What healthy means tonight",
      noteHint: "Write the sentence an operator can check, and the first question they ask.",
    },
    security: {
      title: "Who, and what they may do",
      promise: "Separate identity from permission, and keep private facts from leaking.",
      objectives: [
        "Tell authentication from authorisation in plain words.",
        "Name three common ways a private fact escapes.",
        "Choose the smaller permission, on purpose.",
      ],
      start: [
        "Authentication answers: who are you? Authorisation answers: what may you do? A login proves the first. It does not grant the second. A student who can sign in must not therefore see every student's grades. A stallholder who can sign in must not see another stall's takings.",
        "Security for a system used by non-developers is mostly this discipline, plus care with secrets. People will do the easy thing. The easy thing must also be the safe thing.",
      ],
      how: [
        "The road between the browser and the application is encrypted, so a stranger on the network cannot read the page. Secrets, such as passwords and keys, live outside the project and outside the logs. Each person has their own login. A shared password feels friendly and makes every action impossible to attribute, and impossible to remove when someone leaves.",
        "Private facts leak through ordinary mistakes. They are put in the address bar, where they are copied and logged. They are left in a backup on a laptop. They are shown to a role that did not need them. They are written into a checklist log. Least privilege means each role sees only what the job needs.",
      ],
      expert: [
        "Threats are specific. Write: who might want this record, what they already can do, and what would count as a leak. A grade book leaks if a student sees another's marks, if a lost laptop holds the backup, or if a URL with a student number can be guessed. It does not require a film plot.",
        "Sessions are cookies the browser holds. They should be impossible for a script on another site to steal, short enough to expire, and useless if copied into a log. Rate limits stop a script from trying a million passwords. None of this replaces the basic split: who you are, and what you may do.",
      ],
      example: [
        "Harbor Market gives each stallholder their own login. They can edit their stall. They cannot open the takings of the stall beside them. The office role can. The public can see opening hours and nothing else.",
        "A backup of the stall book is encrypted and kept by the named owner, not on a personal laptop in a bag. The address of a page never contains a private total.",
      ],
      narration:
        "Authentication asks who you are. Authorisation asks what you may do. A login is not a permission to see everything. Give each person their own login. Keep secrets out of the project and out of the logs. Private facts leak through address bars, backups on laptops, and roles that can see too much. At Harbor Market a stallholder sees their own stall, not the takings next door.",
      checkPrompt: "Which statement is right?",
      checkOptions: [
        "Authentication and authorisation are two words for the same thing",
        "Authentication says who you are. Authorisation says what you may do",
        "A long password is the whole of security",
        "Hiding the page is as good as a permission",
      ],
      benchTitle: "Which designs leak?",
      benchPrompt: "Westfield College's grade book. Choose the three designs that leak. Leave the three safer ones alone.",
      benchItems: [
        "One shared password for all teachers, written on the staff-room board",
        "A student's grades placed in the address bar",
        "The nightly backup copied onto a teacher's personal laptop",
        "Each teacher and each student has their own login",
        "The backup is locked, and only a named role can open it",
        "A student can see their own grades, and a teacher can see their own class",
      ],
      benchSlots: [],
      caseOrg: "Westfield College",
      caseFile: "WC-10",
      caseTitle: "The grade book",
      caseSituation: [
        "Westfield keeps marks for every student. Teachers enter them. Students look up their own. A vendor demo uses one password for the whole staff, and the student number appears in the web address so it is easy to share a link.",
        "Students are young. Staff are busy. The easy path will be the path they take. The easy path has to be the one that does not leak.",
      ],
      caseTask: "Say who may see what, and close three leaks.",
      caseSteps: [
        "List the roles: student, teacher, office.",
        "Write what each role may see, and what they must not.",
        "Mark the shared password, the address bar, and the laptop backup as the leaks to close.",
        "In the note, describe the safer design in words a head of year could approve.",
      ],
      decisions: [
        {
          prompt: "How do people sign in?",
          options: ["One shared password on the staff-room board", "Each person has their own login", "No login, the page is obscure"],
        },
        {
          prompt: "Who sees a student's grades?",
          options: ["Anyone who can sign in", "The student sees their own. A teacher sees their class. The office sees what its job needs", "The grades are public, to save support calls"],
        },
        {
          prompt: "Where does the backup live?",
          options: ["On a teacher's personal laptop", "Locked, opened only by a named role", "In the staff chat"],
        },
      ],
      noteLabel: "The safer grade book",
      noteHint: "Say who sees what, and how the three leaks are closed.",
    },
    futures: {
      title: "What changes, what holds",
      promise: "Notice real shifts in how systems are built, and refuse to gamble the promise.",
      objectives: [
        "Name changes that are actually arriving, without the sales words.",
        "Name what does not go out of date: the task, the record, the failure, the care.",
        "Prefer a future you can leave.",
      ],
      start: [
        "Tools, platforms, and fashions change. People still need to finish a task, trust a record, and get help when it fails. A future trend is worth attention when it changes where the work runs, who holds the data, or how a person asks for something. It is not worth attention only because it is new.",
        "Systems for non-developers will keep needing a client-facing door and a support system behind it. That support may one day sit closer to the person, on a device, or further away, in a shared service. The promise has to survive either move.",
      ],
      how: [
        "Watch three shifts. Work may run nearer the person, so a kiosk or a phone can keep a small promise even when the network drops, and send the record later. The organisation holding the data may not be the one the person thinks of, so contracts and exits matter. People may ask in ordinary speech, which means the system still needs a clear task underneath the conversation.",
        "What holds: design from the task, a decision that lives in a known room, a checklist, a way back, a map for the next person, an exact record, a way to see a failure, and a split between who someone is and what they may do. Those do not expire when a vendor does.",
      ],
      expert: [
        "A future-proof choice is one you can leave. Can you export the record? Can another team run the checks? Can you turn the new door off? If the answer is no, you have not bought a future. You have rented a trap. Write the exit on the day you enter.",
        "Do not bet a school, a clinic, a market, or a festival on a single fashionable service that you cannot inspect and cannot leave. Use the new thing at the edge, where a failure is survivable. Keep the record where you can still read it in ten years.",
      ],
      example: [
        "Harbor Market may one day let a stallholder speak the hours instead of tapping them. The task is unchanged: these hours, this stall, this person allowed to say so. The record is unchanged. The spoken door is a new platform in front of the same rooms.",
        "If the speech service closed, the phone page would remain. That is the test. The market does not keep the only copy of its hours inside a service it cannot export.",
      ],
      narration:
        "Tools will change. The promise should not. People still need to finish a task, trust a record, and get help when it fails. You may move work closer to the person, or let them ask in ordinary speech. Keep a way to leave. At Harbor Market a spoken door could sit in front of the same stall book. If that door closed, the record would still be theirs.",
      checkPrompt: "What does not go out of date?",
      checkOptions: [
        "The vendor's current fashion",
        "The promise to the person: the task, the record, the care when it fails",
        "This year's visual fashion",
        "A slogan about the future",
      ],
      benchTitle: "What you keep",
      benchPrompt: "The National Reading Room must plan five years ahead. Which stance do you take?",
      benchItems: [
        "Adopt a slogan and a single vendor, and put the only copy of the catalogue there.",
        "Prepare to change tools, and refuse any choice you cannot leave. The catalogue stays exportable.",
        "Freeze every tool forever, so nothing new can be tried at the edge.",
      ],
      benchSlots: [],
      caseOrg: "National Reading Room",
      caseFile: "NR-11",
      caseTitle: "Five years of the catalogue",
      caseSituation: [
        "The Reading Room lends to the public and keeps a catalogue staff rely on. A vendor offers a beautiful new front door, on the condition that the catalogue lives only inside their service. Leaving later would mean losing the history of the loans.",
        "Readers and desk staff are not developers. They will love a simpler door. They will not love a catalogue they cannot get back.",
      ],
      caseTask: "Write what you keep, what you prepare to change, and what you refuse to gamble.",
      caseSteps: [
        "State the promise that must still be true in five years.",
        "Name one new door you would be willing to try at the edge.",
        "Name the exit: how the catalogue leaves with you.",
        "In the note, write the brief you would actually give the board.",
      ],
      decisions: [
        {
          prompt: "What do you keep, whatever the tools do?",
          options: ["The vendor relationship", "The catalogue and the loan record, readable without the vendor", "The slogan"],
        },
        {
          prompt: "What do you prepare?",
          options: ["To stay, even if you cannot export", "A way to leave, tested, before you depend on the new door", "Nothing. Five years is too far to plan"],
        },
        {
          prompt: "What do you refuse?",
          options: ["A design where the only copy sits in a service you cannot leave", "Any new door, even a small trial", "A written brief to the board"],
        },
      ],
      noteLabel: "The brief to the board",
      noteHint: "Say what you keep, what you would try, and what you will not gamble.",
    },
  },
  brief: {
    title: "Harbor Market, end to end",
    dek: "One market. Eleven promises. A brief a director can read.",
    situation: [
      "You have practised the same ideas in a clinic, a bus company, a school, a hospital, a charity, a festival, a parcel network, a college, and a library. Harbor Market is where they meet.",
      "Stallholders are not developers. Shoppers are in a hurry. The office is small. The board must be true on a Saturday night, and still be yours in five years.",
    ],
    task: "Write the operating brief: one choice for each promise, and a closing note in your own words.",
    steps: [
      "Read your earlier case notes in the dossier. They are the practice. This page is the transfer.",
      "Answer each promise for Harbor Market, not for the other organisations.",
      "Keep the public board, the stall book, and the people in view at the same time.",
      "In the closing note, tell a new director what must never be gambled.",
    ],
    decisions: [
      { prompt: "Where does the staff workbench live?", options: ["On one laptop that goes home", "On a shared workbench with a history", "On paper"] },
      { prompt: "How do the shopper, the stallholder, and the office meet the stall book?", options: ["Three separate systems", "Three doors, one record", "A phone app only, no desk"] },
      { prompt: "What do you design first?", options: ["The screens", "The task: what is open, and who may say so", "The logo"] },
      { prompt: "Where does 'may this person edit this stall?' live?", options: ["Only in the browser", "In the application", "Only in the database"] },
      { prompt: "A checklist is red on a festival morning. What happens?", options: ["Ship the change later in the day anyway", "Block it. Open on the last green version", "Skip the checks"] },
      { prompt: "How do you release a change to the public board?", options: ["Everything, at opening time", "A small step, with a rehearsed way back", "Silently"] },
      { prompt: "A new staff member must change a holiday closing. How is the system shaped?", options: ["One pile, including any payments", "The words apart from anything that must stay exact, with a map", "Frozen, so nothing can change"] },
      { prompt: "On a crowded night, what stays exact?", options: ["The animation", "The record of a change, and any payment", "Nothing, close the market"] },
      { prompt: "A stallholder says a change did not save. What do you want?", options: ["Hope", "The path of that one request, and an alert a person can act on", "An immediate reboot as the only tool"] },
      { prompt: "Who sees a stall's private notes?", options: ["Anyone with the shared office password", "The stallholder, and the office role that needs them", "The public"] },
      { prompt: "A new spoken door is offered. What do you require?", options: ["The only copy of the hours moves into that service", "You can leave. The record stays exportable", "No new door may ever be tried"] },
    ],
    noteLabel: "The note to the director",
    noteHint: "Say what Harbor Market must never gamble: the record, the people, and the way back.",
    narration:
      "This is the whole market, in one brief. Stallholders are not developers. The board has to be true on a Saturday night, and the record still has to belong to the market in five years. Choose the shared workbench, one record behind the doors, a checklist that can say no, a small release with a way back, a map for the next person, an exact record when the crowd arrives, a way to see a failure, permissions that match the job, and a future you can leave.",
  },
};
