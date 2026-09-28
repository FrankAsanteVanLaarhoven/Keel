import type { OpsPack } from "./types";

export const en: OpsPack = {
  sections: {
    web: {
      title: "The web and the internet",
      promise: "Tell the network from the documents it carries, and follow one request until the server answers.",
      objectives: [
        "Separate the web from the internet in one sentence.",
        "Name IP, TCP, and HTTP by the job each one does.",
        "Walk a request from the open port to the response, and leave secrets out of it.",
      ],
      start: [
        "The internet is the network of computers. The web is the documents, sound, and video those computers exchange. Tim Berners-Lee drew that line: on the internet you find computers; on the web you find works. A page can fail while the cables are fine, and the cables can fail while the page is still a file on a disk.",
        "A packet is a piece of that work plus a header, so the far machine knows what the piece is for. The message is split into packets, the packets move as bits, and routers and switches forward them. At the far end they are put back in order. If the header and the data disagree, the receiver cannot safely show anything.",
      ],
      how: [
        "Three agreements do most of the carrying. IP moves packets from one network to another. TCP checks that those packets arrived and puts them back together as a connection. HTTP is the agreement for a web request: a method, a path, headers, and later a status, headers, and a body.",
        "A client asks. A server listens on a port. The server accepts the TCP connection, reads the method, the path, and the headers, and checks that the method is allowed and the path is one it knows. A file is fetched from disk. A page built from a record is handed to the application. An API call runs the code that reads or changes data. The response carries a status such as 200, 404, or 500, the headers, and the body. Before it is sent, the server checks that a secret is not in that body, and that a redirect is used when one is required. The response then goes back on the same connection, in packets. Older HTTP, or a client that asks, closes the connection. Otherwise it can stay open so the next request skips the handshake.",
      ],
      expert: [
        "The machine in the rack is hardware: a blade or a tower, small enough to sit in an enclosure, with a processor, memory, storage, and network ports. A server farm is a building full of them. The server you configure is software that uses that hardware. People say the server for both. When a status page fails, you still have to know which one you mean.",
        "Northline Payments keeps a public status line, open or held, for staff who are not engineers. The line is a file. The ledger key stays in the environment of the application. A 500 that prints the key is not an outage of the internet. It is a response that failed its last check.",
      ],
      figure: "A request moves as packets across the internet, then becomes an HTTP response on the server.",
      links: [],
      narration:
        "The internet is the network of computers. The web is the documents those computers exchange. A packet carries a piece of the work and a header. IP moves packets, TCP checks the connection, and HTTP carries the request and the response. The server listens, accepts, reads, validates, answers, and then closes or keeps the connection. The ledger key stays off the status page.",
      checkPrompt: "Which sentence matches the difference between the web and the internet?",
      checkOptions: [
        "The web is the cables between the buildings",
        "The web is the documents and media; the internet is the network that moves the packets",
        "They are two names for the same thing",
        "The web is only the window of the browser",
      ],
      labTitle: "Run one status request",
      labScene: [
        "Northline's status service is listening. The request on the wire is GET /status HTTP/1.0, host status.northline.example, Connection: close. The file /status contains the line Northline payments: open. The environment holds LEDGER_KEY. That key is not part of the file.",
        "Put the server's work in the order it actually happens. Then choose the status, the body, and what happens to the connection. Run it before you record it. The panel shows the response your choices would send.",
      ],
      labWarn: "That response carries LEDGER_KEY, or it is a 500. The status file exists. The key stays in the environment.",
      fields: {
        path: {
          prompt: "Put the server's work in order.",
          options: [
            "Listen on the port",
            "Accept the TCP connection",
            "Read the method, the path, and the headers",
            "Check the method and the path",
            "Build the status, the headers, and the body",
            "Send the response, then close this connection",
          ],
        },
        status: { prompt: "Which status fits this request?", options: ["200 OK", "404 Not Found", "500 Internal Server Error"] },
        body: { prompt: "Which body is sent?", options: ["The status file", "LEDGER_KEY from the environment", "An empty body"] },
        connection: {
          prompt: "The client asked for Connection: close on HTTP/1.0. What does the server do after the response?",
          options: ["Close the connection", "Keep it open for more requests"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-01",
      caseTitle: "The status page and the key",
      caseSituation: [
        "At 08:10 the status page showed a 500 and the text of LEDGER_KEY. The night engineer said the internet was down. The network graphs were quiet. The file /status was still the line Northline payments: open.",
        "Staff at the payments desk refresh that page before they open the tills. They are not engineers. They need one true line, and they must never see a key.",
      ],
      caseTask: "Decide what actually failed, what the next response must contain, and what happens to the connection.",
      caseSteps: [
        "Separate the quiet network from the response the server chose to send.",
        "Read the request again: GET /status, HTTP/1.0, Connection: close, and the file exists.",
        "Answer the three decisions.",
        "In the note, say what the desk should see, and what must never appear there.",
      ],
      decisions: [
        {
          prompt: "What failed at 08:10?",
          options: ["The internet, meaning the cables", "The server answered badly for a file that exists", "The colour of the browser"],
        },
        {
          prompt: "What does the next response contain?",
          options: ["The same body, so engineers can see the key", "The status line, and the key stays on the server", "The key in a header, which is safer"],
        },
        {
          prompt: "The client sent HTTP/1.0 and Connection: close. After a valid response, what happens?",
          options: ["The socket stays open forever", "The server closes the connection", "A second connection is opened for the same response"],
        },
      ],
      noteLabel: "Your note to the payments desk",
      noteHint: "Write what /status should show, and what must never appear on that page.",
    },
    git: {
      title: "Git and the shared history",
      promise: "Keep a history a stranger can follow, and keep secrets out of it.",
      objectives: [
        "Say what Git does, and what a host such as GitHub adds.",
        "Commit a small change on a branch, with a message that says what changed.",
        "Leave the main branch green, and leave credentials out of the tree.",
      ],
      start: [
        "Git is the history on the machine: snapshots, branches, and the difference between what you have and what you last recorded. A host such as GitHub stores that history where other people can be given access. Git works without the host. The host is not the history.",
        "A repository is readable when its name means something and the README says what the project is, what it depends on, how to run it, and how to test it. Commit in small pieces that each do one thing: a feature, a fix, or a refactor. One commit at the end called final version is a pile, not a history.",
      ],
      how: [
        "Write the message in the imperative, and name the change. Return 404 when the status path is unknown is a message. Update, Changes, and Final version do not tell the next person what moved. Review the diff before you commit. Take out prints, scraps, and files that do not belong.",
        "Do the work on a branch named for the job, such as feature/status-404. Merge it to main only when it builds, the tests pass, and the checks are green. Main is the line another person can run. Passwords, keys, tokens, connection strings, and personal data stay in the environment, or in a file that gitignore excludes. If a live key lands in a commit, remove it and rotate the key. A private repository is not a safe for a live key.",
      ],
      expert: [
        "Layout is part of the history. Source, tests, documents, and configuration live in obvious places. Do not commit build output, dependency folders, or editor scraps unless the project has a stated reason. When the way to run the project changes, change the README in the same work.",
        "Northline's status service is a small repository. The tree in front of you has a real fix, a README line, a .env with a live key, a built file, and a scratch note. Only two of those belong in the next commit, and that commit does not land on main by itself.",
      ],
      figure: "The fix and the README go on a branch. The secret, the build, and the scratch note stay out. Main moves after the checks are green.",
      links: [],
      narration:
        "Git is the history on the machine. A host such as GitHub is where that history can be shared. Commit small pieces, with a message that names the change, on a branch. Main stays green. Secrets stay out of the tree, and a leaked key is rotated.",
      checkPrompt: "What is GitHub, next to Git?",
      checkOptions: [
        "The version control that runs on your machine",
        "A host for Git repositories, with access you can grant",
        "The server that deploys the status page",
        "The monitor that pages you at night",
      ],
      labTitle: "Choose the commit",
      labScene: [
        "The working tree has five changes. README.md explains how to run the checks. src/status.ts returns 404 when the path is unknown. .env contains API_KEY=live-secret. dist/app.js is build output. notes.tmp is a scratch note.",
        "Choose the files that belong in one commit, the message, and the branch. Run it and read the commit you are about to make. Main should still be the last green line.",
      ],
      labWarn: "That commit includes a secret, build output, or a scratch note, or it moves main. Keep the key out, and leave main where it is.",
      fields: {
        files: {
          prompt: "Which files go into this commit?",
          options: [
            "README.md, how to run the checks",
            "src/status.ts, unknown paths return 404",
            ".env, API_KEY=live-secret",
            "dist/app.js, build output",
            "notes.tmp, a scratch note",
          ],
        },
        message: {
          prompt: "Which message belongs on the commit?",
          options: ["Update", "Return 404 when the status path is unknown", "Final version"],
        },
        branch: {
          prompt: "Where does this commit land?",
          options: ["On main, now", "On feature/status-404, and main stays as it is"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-02",
      caseTitle: "The key on main",
      caseSituation: [
        "A contractor pushed one commit to main. The message is Final version. The diff adds the 404 fix, and it also adds .env with a live key. There is no branch, and the README still says the project cannot be run.",
        "The status service is what the payments desk trusts in the morning. The next person has to be able to run main, and the live key has to stop working.",
      ],
      caseTask: "Decide what happens to the key, how the fix is described, and where the next work lands.",
      caseSteps: [
        "Treat the key as already exposed, even if the repository is private.",
        "Separate the useful fix from the files that should never have been committed.",
        "Answer the three decisions.",
        "In the note, say what you rotate, and what main is allowed to contain tomorrow.",
      ],
      decisions: [
        {
          prompt: "The live key is in the commit. What do you do?",
          options: ["Leave it, because the repository is private", "Remove it from the tree and rotate the key", "Email the key to the team so they have a copy"],
        },
        {
          prompt: "Which message belongs on the fix?",
          options: ["Update", "Return 404 when the status path is unknown", "Final version"],
        },
        {
          prompt: "Where does the next change land first?",
          options: ["Directly on main", "On a branch, then main after the checks are green", "In a zip file in chat"],
        },
      ],
      noteLabel: "Your note to the next person on the repository",
      noteHint: "Write what you do with the leaked key, and what main must contain tomorrow.",
    },
    devops: {
      title: "Development and operations",
      promise: "Build, test, and release as one continuous practice, and measure it with four numbers.",
      objectives: [
        "Define DevOps as development and operations on one path to release.",
        "Sort a task into development, operations, or automation.",
        "Read deployment frequency, lead time, failure rate, and time to restore from a log.",
      ],
      start: [
        "DevOps joins development and operations so software is built, tested, and released as one practice, and the service stays up afterwards. It is continuous. The aim is software that is fit to run, not a handoff over a wall.",
        "Development writes the change, adds the feature, fixes the defect, runs the unit tests, designs the application, keeps the version history, and works in a development environment. Operations runs the service, looks after the infrastructure, keeps it available, watches production, runs the servers and the network, deploys, and owns production. You will often specialise. You still need to see where the two sides meet.",
      ],
      how: [
        "Automation removes manual work that does not need a person: the test run, the deploy, the rollback. A person still decides what good means. The machine repeats the steps that should not vary with who is awake.",
        "You can practice this on a system that is yours alone. The history, the checks, and the way back still have to make sense to the next person, including a future you. Four numbers, from the DORA research programme, keep the practice honest. Deployment frequency is how often you deploy. Lead time is the time between accepting a change and deploying it. Change failure rate is how often a deployment fails. Time to restore is how long it takes to recover the service.",
      ],
      expert: [
        "A monthly release, a week of lead time, failures that wait until Monday, and no written restore is a practice that cannot see itself. The four numbers do not replace judgement. They stop you from calling a rare, fragile release a success because the demo looked calm.",
        "Northline deployed four times in the log in the lab. One of those deployments failed. The service was back the same evening. Classify the work, then read the four numbers off the log. A failed deployment still counts as a deployment.",
      ],
      figure: "Development changes the software. Operations runs it. Automation repeats the steps that must not depend on who is awake. Four numbers tell you whether the release is healthy.",
      links: [{ href: "https://dora.dev/", label: "DORA" }],
      narration:
        "DevOps joins development and operations so a change is built, tested, released, and kept running. Automation takes the manual steps that should not need a person. Four DORA numbers keep it honest: how often you deploy, how long from acceptance to deploy, how often a deploy fails, and how long a restore takes.",
      checkPrompt: "How many DORA metrics measure delivery and recovery?",
      checkOptions: [
        "One: how often you deploy",
        "Four: frequency, lead time, failure rate, and time to restore",
        "Twelve: one for each month",
        "None: DevOps is only a mood",
      ],
      labTitle: "Read the week",
      labScene: [
        "Northline's log, in local time. Monday 09:00 accepted, 11:00 deployed, succeeded. Tuesday 10:00 accepted, 18:00 deployed, failed, 20:30 service restored. Thursday 09:00 accepted, 09:30 deployed, succeeded. Friday 12:00 accepted, 13:00 deployed, succeeded.",
        "Sort three pieces of work. Then read the four numbers from that log. Tuesday's lead time is from 10:00 to 18:00. The restore is from the failed deploy until 20:30. Count the failed deploy in the frequency.",
      ],
      labWarn: "The log is the source. Check each number against the times before you record it.",
      fields: {
        code: {
          prompt: "Writing the unit test for the status line is which kind of work?",
          options: ["Development", "Operations", "Automation"],
        },
        watch: {
          prompt: "Watching the production error rate is which kind of work?",
          options: ["Development", "Operations", "Automation"],
        },
        rollback: {
          prompt: "A script that rolls back a failed deploy, without someone typing it, is which kind of work?",
          options: ["Development", "Operations", "Automation"],
        },
        frequency: {
          prompt: "How many deployments are in this log?",
          options: ["One this week", "Four this week", "Twenty this week"],
        },
        lead: {
          prompt: "How long is the lead time of Tuesday's change, from acceptance to deployment?",
          options: ["30 minutes", "8 hours", "A week"],
        },
        fail: {
          prompt: "How many of those deployments failed?",
          options: ["None", "One of the four", "All of them"],
        },
        restore: {
          prompt: "How long did it take to restore service after Tuesday's failed deployment?",
          options: ["10 minutes", "2 hours 30 minutes", "The weekend"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-03",
      caseTitle: "The weekend restore",
      caseSituation: [
        "Last quarter Northline deployed once a month. A change accepted on the first Monday often shipped three weeks later. About one deploy in three failed, and the service sometimes stayed wrong until the next Monday. There was no script to roll back.",
        "Someone on the desk said DevOps does not apply, because there is no separate operations team. The payments status is still their service. The log in the lab is the newer week, where one failure was restored the same evening.",
      ],
      caseTask: "Decide what one person can still do, which number is the restore, and what should run without a person at the keyboard.",
      caseSteps: [
        "Use the lab log as the evidence, not the memory of the quarter.",
        "Name the restore interval separately from the lead time.",
        "Answer the three decisions.",
        "In the note, write the four numbers for the lab week, and name the step that should be automatic.",
      ],
      decisions: [
        {
          prompt: "There is no separate operations team. What do you do on the night of a failure?",
          options: ["Wait for a team that does not exist", "Trace it, restore it, and write the four numbers", "Treat DevOps as something that only a department can do"],
        },
        {
          prompt: "On the lab log, which interval is time to restore?",
          options: ["Thursday, from 09:00 to 09:30", "Tuesday, from the failed deploy at 18:00 until 20:30", "The count of deploys in the week"],
        },
        {
          prompt: "What should be automatic?",
          options: ["Hiding a failed deploy so the board stays calm", "The rollback, so nobody has to type it at night", "Every production change, with no record"],
        },
      ],
      noteLabel: "Your note on the week's delivery",
      noteHint: "Write the four numbers for the lab week, and name the step that should run without a person.",
    },
    finops: {
      title: "Cost, trust, and value",
      promise: "Know what the spend is for, and refuse a bill that buys no outcome.",
      objectives: [
        "Treat a shared paid account as a trust, not as spare capacity.",
        "Attribute a cloud cost to the service that causes it, and cap what is idle.",
        "Judge model spend by the outcome a person actually uses.",
      ],
      start: [
        "Once a service is real, some of the tools are paid for: runners, databases, seats, models. A shared paid account is a trust. Personal work, and quiet copies of production data, do not belong on it. The bill is part of the system.",
        "FinOps is the practice of seeing that cost, attributing it to the service that causes it, and deciding what to keep. A specialist can go deeper later. The decision in front of you is already concrete: keep, cap, or stop.",
      ],
      how: [
        "Idle CI runners that sit overnight are not free speed. Cap them to the builds you actually run, and keep those minutes on the service that needs them. A production database that holds the ledger is the service. You do not stop it to make the bill smaller, and you do not hide it on a personal card.",
        "Model tokens are a cost with a question attached: is this use producing an outcome someone uses? Token economics watches the production, consumption, and cost of that use across its life. A nightly summary that nobody has opened for a month is not an outcome. A larger context window does not fix an unread page. Stop it until a person uses the result in a decision.",
      ],
      expert: [
        "Cap is not stop. Cap the idle capacity of a thing you still need. Stop a thing that has no user, or that breaks the trust of the shared account. Keep the thing the service cannot run without, and say which service it belongs to.",
        "Northline's month is four lines on one shared account: CI, the ledger database, an unread model summary, and a personal transcode. The lab is that bill. The capstone is the note you would send to the person who pays it.",
      ],
      figure: "Keep what the service cannot run without. Cap what is idle. Stop what nobody uses, and take personal work off the shared account.",
      links: [
        { href: "https://www.finops.org/", label: "FinOps Foundation" },
        { href: "https://www.tokeneconomics.com/state-of-tokenomics/", label: "State of Tokenomics" },
      ],
      narration:
        "A shared paid account is a trust. FinOps attributes each cost to the service that causes it. Cap idle runners. Keep the ledger database. Stop model spend that nobody uses. Take personal work off the shared account.",
      checkPrompt: "When is spend on a model justified?",
      checkOptions: [
        "When the bill is large enough to look serious",
        "When the tokens change an outcome a person actually uses",
        "When the vendor says the model is advanced",
        "When the key is shared so everyone can try it",
      ],
      labTitle: "Mark the bill",
      labScene: [
        "One shared Northline account, this month. CI runners, 400 dollars, mostly idle overnight, and the real builds need a fraction of that. The ledger database, 220 dollars, holds the payments record. Model summaries, 900 dollars, and the summary page has had no readers for a month. Personal video transcode, 300 dollars, run by one person on the shared account.",
        "Mark each line keep, cap, or stop. Run it and read the bill you are about to defend. Capping does not remove a personal workload. Keeping the unread summaries leaves the 900 dollars in place.",
      ],
      labWarn: "A personal workload is still on the shared account, or the unread summaries are still being paid for. The trust and the outcome are the test.",
      fields: {
        ci: { prompt: "CI runners, 400 dollars, mostly idle overnight.", options: ["Keep", "Cap", "Stop"] },
        db: { prompt: "Ledger database, 220 dollars, the payments record.", options: ["Keep", "Cap", "Stop"] },
        tokens: { prompt: "Model summaries, 900 dollars, no readers for a month.", options: ["Keep", "Cap", "Stop"] },
        shared: { prompt: "Personal video transcode, 300 dollars, on the shared account.", options: ["Keep", "Cap", "Stop"] },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-04",
      caseTitle: "The bill and the trust",
      caseSituation: [
        "The shared account doubled. Half of the new total is the unread model summary. Another line is one person's video transcode. The CI runners are still sized for a busy day they do not have. The ledger database is unchanged, and it is the record the desk depends on.",
        "The person who pays the account asked for one note: what stays, what is limited, and what leaves. They are not asking for a new model.",
      ],
      caseTask: "Attribute the cost, judge the model by its outcome, and take personal work off the shared account.",
      caseSteps: [
        "Name the service that causes each line before you change it.",
        "Separate idle capacity from a line that has no user.",
        "Answer the three decisions.",
        "In the note, say what you cap, what you stop, and what you keep because the desk needs it.",
      ],
      decisions: [
        {
          prompt: "What do you do with the idle CI runners?",
          options: ["Leave them, because speed should feel free", "Cap them, and attribute the minutes to the status service", "Move them onto a personal card and hide the line"],
        },
        {
          prompt: "What do you do with the unread model summaries?",
          options: ["Buy a larger context window", "Stop them until a person uses the result in a decision", "Share the key so more people might read them"],
        },
        {
          prompt: "The personal transcode is on the shared account. What do you do?",
          options: ["Leave it, because the person is learning", "Take it off, and treat the shared account as a trust", "Rename the project so the line looks like production"],
        },
      ],
      noteLabel: "Your note to the person who pays the account",
      noteHint: "Write what you cap, what you stop, and what you keep because the desk needs it.",
    },
  },
  brief: {
    title: "Northline release",
    dek: "Ship the status line once, with a history, four numbers, and a bill you can defend.",
    situation: [
      "Tomorrow the payments desk will refresh /status before the tills open. The file is ready. A live key was found in an old commit on main. Last week one deploy failed and the restore was timed. The shared account still pays for idle runners and an unread summary.",
      "This is one release, not four projects. The response, the history, the measurement, and the spend have to agree.",
    ],
    task: "Choose the response, the history, the measurement, and the spend for this release.",
    steps: [
      "Decide what /status sends, including the connection the client asked to close.",
      "Decide where the fix lives, and what happens to a key that already leaked.",
      "Decide which numbers you will write down for this release.",
      "In the note, say what the desk sees, where the key lives now, and which spend stops.",
    ],
    decisions: [
      {
        prompt: "What does /status send?",
        options: ["A 500 that includes the key", "200 with the status file, no key, and the connection closed", "Nothing, and the socket stays open"],
      },
      {
        prompt: "Where does the fix land?",
        options: ["Straight onto main, with the key still in history", "On a branch, then main after the checks are green, and the key is rotated", "In a zip file in chat"],
      },
      {
        prompt: "What do you record for this release?",
        options: ["Nothing, if the demo looked calm", "Frequency, lead time, failure rate, and time to restore", "Only that you deploy once a month"],
      },
      {
        prompt: "What happens to the shared bill?",
        options: ["Spend stays as it is, including the unread summaries", "Cap the idle runners and stop the unread summaries", "Share the account so the bill is everyone's problem"],
      },
    ],
    noteLabel: "Your release note",
    noteHint: "Write what /status shows, where the key lives now, and which spend stops.",
    narration:
      "The Northline release sends the status file without the key, lands on main only after the checks are green, records the four DORA numbers, caps idle runners, and stops the unread model spend.",
    figure: "One release: a safe status response, a green main, four numbers, and a bill with the idle work capped and the unread work stopped.",
  },
};
