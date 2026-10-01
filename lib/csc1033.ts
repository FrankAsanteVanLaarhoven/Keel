export type WeekId = "w1" | "w2" | "w3" | "w4" | "w5" | "w6" | "w7" | "w8" | "w9" | "w10" | "w11" | "w12";

export type StudioKind = "inspect" | "erd" | "algebra" | "sql" | "join" | "norm" | "btree" | "acid" | "ir" | "rdf" | "quorum" | "ethics";

export type CscWeek = {
  id: WeekId;
  no: number;
  begins: string;
  badge: string;
  title: string;
  promise: string;
  overview: string;
  prelecture: [string, string, string];
  lectureTitle: string;
  lecture: string;
  citation: string;
  syllabus: string;
  industry: string;
  analogy: string;
  practicalTitle: string;
  practical: string;
  capstoneTitle: string;
  capstone: string;
  studio: StudioKind;
  foundry: string;
  checkPrompt: string;
  checkOptions: [string, string, string, string];
  checkAnswer: 0 | 1 | 2 | 3;
  wrap: string;
  narration: string;
};

export const tiers: readonly { no: number; name: string; weeks: WeekId[] }[] = [
  { no: 1, name: "Data Explorer", weeks: ["w1"] },
  { no: 2, name: "Table Builder", weeks: ["w2"] },
  { no: 3, name: "Relationship Builder", weeks: ["w3"] },
  { no: 4, name: "SQL Operator", weeks: ["w4"] },
  { no: 5, name: "Database Engineer", weeks: ["w5", "w6"] },
  { no: 6, name: "Query Optimiser", weeks: ["w7"] },
  { no: 7, name: "Data Architect", weeks: ["w8", "w9", "w10"] },
  { no: 8, name: "Enterprise Data Architect", weeks: ["w11", "w12"] },
];

export const cscWeeks: readonly CscWeek[] = [
  {
    id: "w1",
    no: 1,
    begins: "28/9",
    badge: "Foundations",
    title: "Data foundations and physical representation",
    promise: "How a computer stores a fact, and how structured, tagged, and raw payloads differ.",
    overview: "Week 1 opens the module. You will tell a fact from the marks that store it, and you will inspect the same two library patrons as a table, as a JSON document, and as bytes.",
    prelecture: [
      "Write one sentence that distinguishes data from information.",
      "Name one structured payload, one tagged payload, and one raw payload you have used this week.",
      "Read the chapter note before the lecture on 29/9/26.",
    ],
    lectureTitle: "Lectures 29/9/26 and 1/10/2026 (Introduction, and a first look at entities)",
    lecture: "A bit is a switch that is on or off. Bytes group those switches. A table gives every fact the same columns. A JSON document carries its own names. A photograph or a sound file is a run of bytes with no columns. The second lecture starts the entity idea that week 2 draws in full.",
    citation: "Elmasri, R. and Navathe, S.B. (2015). Fundamentals of Database Systems (7th ed.), Chapter 1. Pearson.",
    syllabus: "Topic 1.1 — Data and information, bits, bytes, and schema kinds.",
    industry: "PostgreSQL stores a row in a heap page. An object store such as Amazon S3 keeps the same bytes without a table. JSON documents travel between the two.",
    analogy: "Data is a fact recorded so it can be found later. Inside the machine every fact is a pattern of bits. A table is a tidy shelf. JSON is a labelled box. A photo is the box with no label on the outside.",
    practicalTitle: "Practical 1/10/2026 (None)",
    practical: "There is no separate practical this week. The inspector below is the lecture activity.",
    capstoneTitle: "Multi-format inspector",
    capstone: "The same two Harbor Library patrons are shown as a table, as JSON, and as the bytes of that JSON. Switch the view. Nothing here is a live student record.",
    studio: "inspect",
    foundry: "/foundry?studio=class",
    checkPrompt: "Which of the following best characterises semi-structured data?",
    checkOptions: [
      "A rigid table with fixed column types and no nested values",
      "Data with internal markers and self-describing tags, such as JSON or XML, and no single pre-declared table",
      "A photograph or audio file with no tags and no columns",
      "A primary key that is shared by every table in a database",
    ],
    checkAnswer: 1,
    wrap: "Next week draws the entities behind this table: patrons, books, and the loans that connect them.",
    narration: "Week 1. Data is a recorded fact. A table has fixed columns. JSON carries its own tags. A photo is raw bytes. The practical this week is the inspector, not a separate lab.",
  },
  {
    id: "w2",
    no: 2,
    begins: "5/10",
    badge: "Conceptual design",
    title: "Conceptual modeling and entity-relationship diagrams",
    promise: "Entities, attributes, keys, and the junction table that untangles a many-to-many loan.",
    overview: "Week 2 is the entity-relationship model. A patron can borrow many books, and a book can be borrowed by many patrons. The loan table is the bridge.",
    prelecture: [
      "Name one entity, one attribute, and one relationship in a library.",
      "Sketch Students, Books, and the line between them before the lecture.",
      "Bring that sketch to the practical on 8/10/2026.",
    ],
    lectureTitle: "Lectures 6/10/26 and 8/10/2026 (Entity-relationship model)",
    lecture: "An entity is a thing the library cares about. An attribute is a fact about that thing. A relationship connects entities. When both sides are many, a junction table holds one row per loan and points at both primary keys with foreign keys. Crow's foot notation draws the many side as a foot. Chen's notation draws the relationship as a diamond.",
    citation: "Chen, P.P. (1976). The Entity-Relationship Model: Toward a Unified View of Data. ACM Transactions on Database Systems, 1(1), pp. 9–36.",
    syllabus: "Topic 1.2 — Entity-relationship modeling and crow's foot notation.",
    industry: "A customer-relationship record and a work-order record meet in a junction when one customer can have many jobs and one job can involve many people.",
    analogy: "Students borrow books. If many students borrow many books, the tangle needs a bridge. That bridge is the Loans table.",
    practicalTitle: "Practical 8/10/2026 (E-R diagram activity)",
    practical: "Build the loan junction in the exercise, then open the same idea on the Foundry entity-relationship canvas. Add entities, mark primary and foreign keys, and draw crow's foot lines.",
    capstoneTitle: "Crow's foot junction",
    capstone: "Students and Books are entities. Loans is the junction. Mark the foreign keys, then continue the drawing in the Foundry.",
    studio: "erd",
    foundry: "/foundry?studio=erd",
    checkPrompt: "What is the primary role of a foreign key in a relational model?",
    checkOptions: [
      "To encrypt a table so an unauthorised reader cannot see the rows",
      "To point at a primary key in another table and support referential integrity",
      "To add up every number in a column",
      "To make every row in the referenced table read-only",
    ],
    checkAnswer: 1,
    wrap: "Week 3 leaves the drawing and treats the tables as mathematical relations.",
    narration: "Week 2. An entity is a thing you care about. An attribute describes it. A many-to-many loan becomes a junction table with foreign keys. The practical on 8 October is the entity-relationship diagram.",
  },
  {
    id: "w3",
    no: 3,
    begins: "12/10",
    badge: "Formal theory",
    title: "The relational model and relational algebra",
    promise: "Relations, tuples, keys, and the operators selection, projection, and product.",
    overview: "A table is a relation: a set of tuples with named attributes. Selection keeps rows. Projection keeps columns. A Cartesian product pairs every row of one relation with every row of another.",
    prelecture: [
      "Write the symbols for selection, projection, and product.",
      "Predict how many rows a product of a 2-row table and a 3-row table will have.",
      "Read Codd's 1970 paper note before Tuesday.",
    ],
    lectureTitle: "Lectures 13/10/2026 and 15/10/2026 (Relational model and algebra)",
    lecture: "Selection, written sigma, filters tuples. Projection, written pi, chooses attributes and drops duplicates in the formal model. The product, written times, is the unfiltered pairing that a join later restricts. A candidate key uniquely identifies a tuple.",
    citation: "Codd, E.F. (1970). A Relational Model of Data for Large Shared Data Banks. Communications of the ACM, 13(6), pp. 377–387.",
    syllabus: "Topic 2.1 — Codd's relational model and the algebraic operators.",
    industry: "A distributed SQL planner turns a statement into a tree of these operators before it chooses a physical join.",
    analogy: "Selection is a sieve for rows. Projection picks columns. The product lays every row of one table beside every row of another.",
    practicalTitle: "Practical 15/10/2026 (Algebra on the patron table)",
    practical: "Run selection and projection on the Harbor patrons. Read the tuple that comes back.",
    capstoneTitle: "Relational algebra sandbox",
    capstone: "The patrons are Alex Mercer, Elena Rostova, and Sam Okonkwo. Filter the 10A class, then project the names.",
    studio: "algebra",
    foundry: "/foundry?studio=class",
    checkPrompt: "In relational algebra, what does the selection operator do?",
    checkOptions: [
      "It keeps chosen columns and drops the others",
      "It keeps the tuples that satisfy a predicate",
      "It creates a new stored table and deletes the old one",
      "It sorts tuples by the primary key",
    ],
    checkAnswer: 1,
    wrap: "Week 4 writes the same ideas as SQL statements that change the table.",
    narration: "Week 3. Selection filters rows. Projection keeps columns. The product pairs every row with every row. You will run both on the patron table.",
  },
  {
    id: "w4",
    no: 4,
    begins: "19/10",
    badge: "SQL",
    title: "SQL data definition and data manipulation",
    promise: "CREATE TABLE, types, keys, and INSERT, UPDATE, DELETE, and SELECT.",
    overview: "DDL builds the tables. DML puts rows in, changes them, removes them, and reads them. A primary key rejects a second row with the same identifier.",
    prelecture: [
      "Write a CREATE TABLE for Book with a primary key.",
      "Predict what a second INSERT of StudentID 101 should do.",
      "Keep the prediction for the lab.",
    ],
    lectureTitle: "Lectures 20/10/2026 and 22/10/2026 (SQL syntax and constraints)",
    lecture: "CREATE TABLE names columns and constraints. NOT NULL refuses an empty required value. PRIMARY KEY refuses a duplicate identifier. A FOREIGN KEY names the row it points at. INSERT, UPDATE, and DELETE change rows. SELECT reads them. This lab keeps the tables in memory for the page only.",
    citation: "Chamberlin, D.D. and Boyce, R.F. (1974). SEQUEL: A Structured English Query Language. Proceedings of the ACM SIGFIDET Workshop, pp. 249–264.",
    syllabus: "Topic 2.2 — SQL syntax, table construction, constraints, and mutations.",
    industry: "PostgreSQL and SQLite both reject a duplicate primary key. The lab here is a small engine with the same rule, not those servers.",
    analogy: "DDL is the plan of a house. DML moves the furniture in, moves it, or takes it out. SELECT is how you find a chair.",
    practicalTitle: "Practical 22/10/2026 (Mutation lab)",
    practical: "Run SELECT, then an INSERT that repeats a primary key, and read the rejection.",
    capstoneTitle: "In-memory SQL lab",
    capstone: "Students starts with Alex Mercer and Elena Rostova. The engine accepts a new key and rejects a duplicate.",
    studio: "sql",
    foundry: "/foundry?studio=erd",
    checkPrompt: "What happens when an INSERT adds a row whose primary key is already present?",
    checkOptions: [
      "The engine overwrites the existing row and stays silent",
      "The statement is rejected and reports a primary-key uniqueness violation",
      "The engine stores a second copy and adds a suffix to the key",
      "The whole database shuts down",
    ],
    checkAnswer: 1,
    wrap: "Week 5 joins two tables and looks at the plan that does the work.",
    narration: "Week 4. DDL builds the table. DML changes the rows. A duplicate primary key is rejected. You will try that rejection in the lab.",
  },
  {
    id: "w5",
    no: 5,
    begins: "26/10",
    badge: "Query plans",
    title: "Relational joins and query execution plans",
    promise: "Inner and left joins, and why a hash join can avoid a nested loop.",
    overview: "A join pairs rows by a condition. An inner join keeps matches. A left join keeps every row from the left table and fills the right side with null when nothing matches.",
    prelecture: [
      "Write the difference between an inner join and a left join in one sentence.",
      "Name a patron who might have no current loan.",
      "Read the Graefe survey note.",
    ],
    lectureTitle: "Lectures 27/10/2026 and 29/10/2026 (Joins and plans)",
    lecture: "A nested loop compares every left row with every right row. A hash join builds a table of the smaller side and probes it. EXPLAIN is how a real engine shows which plan it chose. This page shows the shape of a hash join; it does not call PostgreSQL.",
    citation: "Graefe, G. (1993). Query Evaluation Techniques for Large Databases. ACM Computing Surveys, 25(2), pp. 73–170.",
    syllabus: "Topic 3.1 — Multi-table joins and execution algorithms.",
    industry: "PostgreSQL can choose a hash join, a nested loop, or a merge join. The choice depends on estimates, indexes, and memory.",
    analogy: "An inner join keeps the puzzle pieces that fit. A left join keeps every piece from the left, even when the right side is missing.",
    practicalTitle: "Practical 29/10/2026 (Join sandbox)",
    practical: "Run the inner join and the left join. Elena has no loan. Watch her row stay, with an empty loan.",
    capstoneTitle: "Join sandbox and hash-join plan",
    capstone: "Harbor patrons and their loans. The plan names the build side and the probe side.",
    studio: "join",
    foundry: "/foundry?studio=erd",
    checkPrompt: "What does a left outer join return when a left row has no match on the right?",
    checkOptions: [
      "The left row is dropped",
      "The left row is kept and the right-hand columns are null",
      "The query stops with a syntax error",
      "The engine copies a random right-hand row into the gap",
    ],
    checkAnswer: 1,
    wrap: "Week 6 asks whether a table repeats a fact, and how to split it.",
    narration: "Week 5. An inner join keeps matches. A left join keeps every left row. A hash join builds one side and probes it.",
  },
  {
    id: "w6",
    no: 6,
    begins: "2/11",
    badge: "Design quality",
    title: "Normalisation and design quality",
    promise: "1NF, 2NF, 3NF, and BCNF, and the anomalies they remove.",
    overview: "If a customer's city is copied onto every order, a move means many updates. Miss one and the data disagrees with itself. Normalisation puts each fact in one place.",
    prelecture: [
      "Give an example of an update anomaly.",
      "State 1NF in your own words: one value in each cell.",
      "Bring a denormalised order row to the lecture.",
    ],
    lectureTitle: "Lectures 3/11/2026 and 5/11/2026 (Normal forms)",
    lecture: "First normal form refuses repeating groups. Second normal form, for a composite key, refuses a partial dependency. Third normal form refuses a transitive dependency: a non-key attribute must not determine another non-key attribute. Boyce-Codd is stricter about overlapping keys. This week stops at a 3NF split you can see.",
    citation: "Codd, E.F. (1972). Further Normalization of the Data Base Relational Model. In Data Base Systems, Courant Computer Science Symposium 6, Prentice-Hall, pp. 33–64.",
    syllabus: "Topic 3.2 — Normalisation, functional dependencies, and third normal form.",
    industry: "A ledger that records a balance twice will drift. Production schemas keep the balance in one row and derive the other view.",
    analogy: "Writing an address in ten rows means ten edits when someone moves. One forgotten row is an update anomaly.",
    practicalTitle: "Practical 5/11/2026 (Decompose an order)",
    practical: "Split the repeated customer city off the order lines.",
    capstoneTitle: "Third normal form decomposer",
    capstone: "Harbor Press appears on two order lines with the same city. The split keeps the city once.",
    studio: "norm",
    foundry: "/foundry?studio=erd",
    checkPrompt: "Which condition is required for a table to be in third normal form?",
    checkOptions: [
      "The table is stored on at least three servers",
      "The table is in second normal form and has no transitive dependency between non-key attributes",
      "Every cell stores a comma-separated list",
      "Every table has at least three primary keys",
    ],
    checkAnswer: 1,
    wrap: "Week 7 asks how the engine finds a row without reading the whole table.",
    narration: "Week 6. Repeating a fact causes update anomalies. Third normal form removes transitive dependencies. You will split a customer city off the order lines.",
  },
  {
    id: "w7",
    no: 7,
    begins: "9/11",
    badge: "Storage",
    title: "Physical storage, B-tree indexes, and query cost",
    promise: "Why a B-tree find is a few page reads, and a scan reads every row.",
    overview: "A heap is the pile of rows. An index is a separate structure that maps a key to a row. A B-tree keeps keys in order and stays short and wide, so a lookup is a few pages even when the table is large.",
    prelecture: [
      "Contrast a full scan with an index seek in one sentence.",
      "Guess how many hops a balanced tree needs for a million keys if each node has about a hundred children.",
      "Read the Bayer and McCreight note.",
    ],
    lectureTitle: "Lectures 10/11/2026 and 12/11/2026 (Files and B-trees)",
    lecture: "A clustered index stores the rows in key order. A non-clustered index stores pointers. Either way, the search follows child pointers from the root. The lab uses a three-node sketch: the root splits at 50 and 100.",
    citation: "Bayer, R. and McCreight, E. (1972). Organization and Maintenance of Large Ordered Indexes. Acta Informatica, 1(3), pp. 173–189.",
    syllabus: "Topic 4.1 — Storage structures, B-trees, and access paths.",
    industry: "PostgreSQL, Oracle, and SQL Server use B-tree indexes for primary keys. InnoDB stores the table itself as a clustered index.",
    analogy: "Without an index you turn every page. With the index at the back you open the right page in a few hops.",
    practicalTitle: "Practical 12/11/2026 (Seek the key 72)",
    practical: "Follow 72 from the root. Compare the hop count with a scan of a million rows.",
    capstoneTitle: "B-tree seek",
    capstone: "The root holds 50 and 100. Keys below 50 go left, keys through 100 go to the middle, and the rest go right.",
    studio: "btree",
    foundry: "/foundry?studio=class",
    checkPrompt: "Why do production databases use a B-tree for a primary key instead of scanning the table?",
    checkOptions: [
      "A B-tree lookup is a short walk down the tree, while a scan reads every row",
      "A B-tree stops people querying the database after hours",
      "A B-tree stores each value many times so a crash cannot lose it",
      "A B-tree removes the need for a primary key",
    ],
    checkAnswer: 0,
    wrap: "Week 8 asks what happens when a transfer crashes halfway.",
    narration: "Week 7. A scan reads every row. A B-tree walks a few pages. You will seek the key 72 from the root.",
  },
  {
    id: "w8",
    no: 8,
    begins: "16/11",
    badge: "Reliability",
    title: "Transactions and ACID",
    promise: "Atomicity, consistency, isolation, durability, and a write-ahead log.",
    overview: "A transfer must not lose money in the middle. Atomicity says the whole transfer commits or the whole transfer rolls back. The log records the intention before the pages change.",
    prelecture: [
      "Expand the four letters of ACID.",
      "Say what should be true of both balances if the server dies mid-transfer.",
      "Read the Gray note.",
    ],
    lectureTitle: "Lectures 17/11/2026 and 19/11/2026 (Transactions)",
    lecture: "Atomicity is all or nothing. Consistency means the rules, including the keys, hold at the commit. Isolation means concurrent transfers do not read each other's half-finished work. Durability means a committed transfer survives a crash. Write-ahead logging writes the log record first.",
    citation: "Gray, J. (1981). The Transaction Concept: Virtues and Limitations. Proceedings of the 7th International Conference on Very Large Data Bases, pp. 144–154.",
    syllabus: "Topic 4.2 — Transaction processing, ACID, and concurrency.",
    industry: "PostgreSQL records changes in a write-ahead log and uses multi-version concurrency so a reader sees a committed snapshot.",
    analogy: "Moving £200 from one account to another must finish, or it must be as if it never started.",
    practicalTitle: "Practical 19/11/2026 (Crash the transfer)",
    practical: "Move £200, then run the same move with the crash switch on. The crash restores both balances.",
    capstoneTitle: "All-or-nothing transfer",
    capstone: "Account A starts at £1000 and account B at £250. The figures are fictional.",
    studio: "acid",
    foundry: "/foundry?studio=ai",
    checkPrompt: "What does atomicity guarantee for a database transaction?",
    checkOptions: [
      "Values are stored on physical atoms",
      "Every statement commits, or the whole transaction rolls back",
      "Concurrent transactions may read uncommitted rows",
      "Every query is rewritten into another language",
    ],
    checkAnswer: 1,
    wrap: "Week 9 leaves tables and looks up words in documents.",
    narration: "Week 8. Atomicity means the whole transfer commits or the whole transfer rolls back. The crash switch restores the balances from the log.",
  },
  {
    id: "w9",
    no: 9,
    begins: "23/11",
    badge: "Retrieval",
    title: "Information retrieval",
    promise: "An inverted index, a query, and why a ranked list is not a table join.",
    overview: "Retrieval starts from words. An inverted index maps each term to the documents that contain it. A query returns the documents that contain the terms, not a relational join.",
    prelecture: [
      "List the documents you would expect for the query borrow books.",
      "Contrast a primary-key lookup with a word lookup.",
      "Note one reason a ranked list can omit a document that merely shares a common word.",
    ],
    lectureTitle: "Lectures 24/11/2026 and 26/11/2026 (Indexes for text)",
    lecture: "Tokenising lowers the case and drops tiny words such as the and of. The posting list for a term is the set of documents. This lab uses three fictional Harbor notes. It does not crawl the web.",
    citation: "Manning, C.D., Raghavan, P. and Schütze, H. (2008). Introduction to Information Retrieval. Cambridge University Press, Chapters 1–2.",
    syllabus: "Topic 5.1 — Inverted indexes and Boolean retrieval.",
    industry: "Search engines keep posting lists. A relational primary key does not answer 'which notes mention loans'.",
    analogy: "The index at the back of a book lists a word and the pages. You do not read every page to find the word.",
    practicalTitle: "Practical 26/11/2026 (Query the notes)",
    practical: "Ask for borrow books and for audio. Read which notes come back.",
    capstoneTitle: "Inverted index",
    capstone: "Three short Harbor notes. The query must match every remaining term.",
    studio: "ir",
    foundry: "/foundry?studio=ai",
    checkPrompt: "What does an inverted index store?",
    checkOptions: [
      "Each term, with the documents that contain it",
      "Each document as a primary key only, with the words discarded",
      "A foreign key from every word to a student row",
      "The bytes of a photograph in page order",
    ],
    checkAnswer: 0,
    wrap: "Week 10 names the links between things, not only the words.",
    narration: "Week 9. An inverted index lists each word and the documents that contain it. You will query three Harbor notes.",
  },
  {
    id: "w10",
    no: 10,
    begins: "30/11",
    badge: "Semantic web",
    title: "Semantic web and linked facts",
    promise: "A triple is a subject, a predicate, and an object. A pattern finds the matching triples.",
    overview: "A relational row packs many facts into columns. A triple states one fact. Harbor Library can say that a copy is a copy of a book without inventing a new column for every kind of link.",
    prelecture: [
      "Write one triple about a book you invent for this class.",
      "Mark which part is the predicate.",
      "Contrast a triple with a foreign key in one sentence.",
    ],
    lectureTitle: "Lectures 1/12/2026 and 3/12/2026 (Triples)",
    lecture: "RDF names resources and states triples. A query pattern leaves a blank where you want the answer. This lab matches blanks against a fixed Harbor graph. It does not publish a public endpoint.",
    citation: "Berners-Lee, T., Hendler, J. and Lassila, O. (2001). The Semantic Web. Scientific American, 284(5), pp. 34–43.",
    syllabus: "Topic 5.2 — Triples and pattern matching over a graph.",
    industry: "A knowledge graph in a catalogue answers 'which copies belong to which work' when the link types grow faster than the columns.",
    analogy: "A sentence has a subject, a verb, and an object. A graph is many such sentences that share names.",
    practicalTitle: "Practical 3/12/2026 (Match a pattern)",
    practical: "Ask which copy is a copy of the Harbor ledger, and which account borrowed a copy.",
    capstoneTitle: "Triple pattern matcher",
    capstone: "The graph is fictional: one work, two copies, one loan.",
    studio: "rdf",
    foundry: "/foundry?studio=erd",
    checkPrompt: "What is a triple in this model?",
    checkOptions: [
      "Three primary keys stored in one cell",
      "One fact with a subject, a predicate, and an object",
      "A join of three tables with no condition",
      "A backup written to three disks",
    ],
    checkAnswer: 1,
    wrap: "Week 11 places the same facts on more than one machine.",
    narration: "Week 10. A triple states one fact: subject, predicate, object. You will match a pattern against the Harbor graph.",
  },
  {
    id: "w11",
    no: 11,
    begins: "7/12",
    badge: "Distributed",
    title: "Cloud and distributed records",
    promise: "Copies, quorums, and what remains readable when a node is down.",
    overview: "One machine fails. A distributed record keeps copies and agrees how many copies must answer. This week uses three fictional nodes and a quorum of two.",
    prelecture: [
      "Say what a copy is for, in one sentence.",
      "If two of three copies must agree, how many can be down before a read fails?",
      "Note one fact you would not want two copies to disagree about.",
    ],
    lectureTitle: "Lectures 8/12/2026 and 10/12/2026 (Copies and quorums)",
    lecture: "A quorum read asks enough copies to be sure it sees the latest acknowledged write. With three copies and a quorum of two, one outage still answers. Two outages do not. The lab does not start a cluster.",
    citation: "Gilbert, S. and Lynch, N. (2002). Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services. ACM SIGACT News, 33(2), pp. 51–59.",
    syllabus: "Topic 6.1 — Replication, quorums, and the cost of a partition.",
    industry: "A cloud database spreads copies across failure domains. The product name matters less than the quorum you configured.",
    analogy: "Three librarians keep the same loan book. You trust an answer when two of them agree. One librarian off sick is fine. Two is not.",
    practicalTitle: "Practical 10/12/2026 (Take a node down)",
    practical: "Read with three nodes up, then with one down, then with two down.",
    capstoneTitle: "Quorum reader",
    capstone: "Three Harbor nodes, quorum two. The loan total is a fictional figure.",
    studio: "quorum",
    foundry: "/foundry?studio=deploy",
    checkPrompt: "With three copies and a read quorum of two, what is true when one copy is down?",
    checkOptions: [
      "A read can still succeed from the two copies that answer",
      "Every read fails until all three copies are back",
      "The down copy's data is deleted",
      "The quorum changes itself to one",
    ],
    checkAnswer: 0,
    wrap: "Week 12 asks who the records are about, and what you may do with them.",
    narration: "Week 11. Three copies and a quorum of two. One node down still answers. Two nodes down do not.",
  },
  {
    id: "w12",
    no: 12,
    begins: "14/12",
    badge: "Judgement",
    title: "Ethics and the horizon of automated decisions",
    promise: "A model is only as honest as the purpose, the consent, and the way a person can be removed.",
    overview: "The module ends with a decision, not a new operator. Harbor Library wants a model that guesses which books to buy. The training rows are patron loans. You decide what has to be true before that model is trained.",
    prelecture: [
      "Name the people in the loan table.",
      "Write the purpose of the buying model in one sentence.",
      "Say how a patron would ask for their rows to be left out.",
    ],
    lectureTitle: "Lectures 15/12/2026 and 17/12/2026 (Purpose, consent, removal)",
    lecture: "An automated decision needs a stated purpose, a lawful basis the institution can explain, and a way to remove a person. Accuracy and fairness are checked on a set that was not used to train. This page does not train a model.",
    citation: "Jobin, A., Ienca, M. and Vayena, E. (2019). The global landscape of AI ethics guidelines. Nature Machine Intelligence, 1, pp. 389–399.",
    syllabus: "Topic 6.2 — Purpose limitation, consent, and removal before a model is trained.",
    industry: "A production training job reads an approved dataset with a named purpose. A convenient export of a live table is not that dataset.",
    analogy: "The loan book is about people. A guess about next year's shelves is a new use. The people get a say, and a way out, before the guess is trained.",
    practicalTitle: "Practical 17/12/2026 (Choose the training rule)",
    practical: "Pick the rule you would write into the project before any training job runs.",
    capstoneTitle: "Training rule",
    capstone: "Four rules. One of them states the purpose and lets a patron remove their rows first.",
    studio: "ethics",
    foundry: "/foundry?studio=ai",
    checkPrompt: "What has to be true before patron loan rows are used to train a buying model?",
    checkOptions: [
      "The export is convenient and the model can be trained the same day",
      "The purpose is stated, and a patron can have their rows removed before training",
      "The model is accurate, so the purpose can be decided afterwards",
      "Names are shortened, which is enough on its own",
    ],
    checkAnswer: 1,
    wrap: "You have walked from a bit to a decision about people. The Foundry keeps the drawings. The ladder records the checks you passed on this browser.",
    narration: "Week 12. A buying model trained on patron loans needs a stated purpose and a way for a patron to be removed before training. The figures in this module are fictional.",
  },
];

export function weekById(id: string): CscWeek | undefined {
  return cscWeeks.find((week) => week.id === id);
}

export type Cell = string | number | null;
export type SqlColumn = { name: string; type: string; pk: boolean };
export type SqlTable = { name: string; columns: SqlColumn[]; rows: Cell[][] };
export type SqlOk = { ok: true; message: string; tables: SqlTable[]; columns: string[]; rows: Cell[][] };
export type SqlErr = { ok: false; message: string; tables: SqlTable[]; columns: string[]; rows: Cell[][] };
export type SqlResult = SqlOk | SqlErr;

export function freshStudents(): SqlTable[] {
  return [{
    name: "Students",
    columns: [
      { name: "StudentID", type: "INT", pk: true },
      { name: "Name", type: "VARCHAR", pk: false },
      { name: "Class", type: "VARCHAR", pk: false },
    ],
    rows: [
      [101, "Alex Mercer", "10A"],
      [102, "Elena Rostova", "10A"],
    ],
  }];
}

function cloneTables(tables: SqlTable[]): SqlTable[] {
  return tables.map((table) => ({
    name: table.name,
    columns: table.columns.map((column) => ({ ...column })),
    rows: table.rows.map((row) => [...row]),
  }));
}

function fail(tables: SqlTable[], message: string): SqlErr {
  return { ok: false, message, tables, columns: [], rows: [] };
}

function parseLiteral(token: string): Cell | undefined {
  const text = token.trim();
  if (text.startsWith("'") && text.endsWith("'") && text.length >= 2) return text.slice(1, -1);
  if (/^-?\d+$/.test(text)) return Number(text);
  return undefined;
}

function splitArgs(source: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote = false;
  for (const char of source) {
    if (char === "'") quote = !quote;
    if (char === "," && !quote) {
      parts.push(current.trim());
      current = "";
    } else current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

export function runSql(source: string, tables: SqlTable[]): SqlResult {
  const sql = source.trim().replace(/\s+/g, " ").replace(/;$/, "");
  const next = cloneTables(tables);
  const select = /^select\s+(.+)\s+from\s+([A-Za-z][A-Za-z0-9]*)(?:\s+where\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*('[^']*'|-?\d+))?$/i.exec(sql);
  if (select) {
    const table = next.find((item) => item.name.toLowerCase() === select[2].toLowerCase());
    if (!table) return fail(tables, "That table is not in this lab. Use Students, or create the table first.");
    const wanted = select[1].trim() === "*" ? table.columns.map((column) => column.name) : splitArgs(select[1]);
    const indexes = wanted.map((name) => table.columns.findIndex((column) => column.name.toLowerCase() === name.toLowerCase()));
    if (indexes.some((index) => index < 0)) return fail(tables, "That column is not in the table.");
    let rows = table.rows;
    if (select[3]) {
      const columnIndex = table.columns.findIndex((column) => column.name.toLowerCase() === select[3].toLowerCase());
      const expected = parseLiteral(select[4]);
      if (columnIndex < 0 || expected === undefined) return fail(tables, "The WHERE clause needs a column and a quoted text or a number.");
      rows = rows.filter((row) => row[columnIndex] === expected);
    }
    return {
      ok: true,
      message: `Query OK, ${rows.length} row${rows.length === 1 ? "" : "s"} in set.`,
      tables,
      columns: indexes.map((index) => table.columns[index].name),
      rows: rows.map((row) => indexes.map((index) => row[index])),
    };
  }
  const insert = /^insert\s+into\s+([A-Za-z][A-Za-z0-9]*)\s+values\s*\((.+)\)\s*$/i.exec(sql);
  if (insert) {
    const table = next.find((item) => item.name.toLowerCase() === insert[1].toLowerCase());
    if (!table) return fail(tables, "That table is not in this lab. Create it, or insert into Students.");
    const values = splitArgs(insert[2]).map(parseLiteral);
    if (values.length !== table.columns.length || values.some((value) => value === undefined)) {
      return fail(tables, "INSERT needs one value per column, as text in quotes or as a number.");
    }
    const pk = table.columns.findIndex((column) => column.pk);
    if (pk >= 0 && table.rows.some((row) => row[pk] === values[pk])) {
      return fail(tables, "The statement is rejected. Primary key uniqueness violation.");
    }
    table.rows.push(values as Cell[]);
    return { ok: true, message: "Query OK, 1 row inserted.", tables: next, columns: table.columns.map((column) => column.name), rows: table.rows };
  }
  const update = /^update\s+([A-Za-z][A-Za-z0-9]*)\s+set\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*('[^']*'|-?\d+)\s+where\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*('[^']*'|-?\d+)\s*$/i.exec(sql);
  if (update) {
    const table = next.find((item) => item.name.toLowerCase() === update[1].toLowerCase());
    if (!table) return fail(tables, "That table is not in this lab.");
    const setAt = table.columns.findIndex((column) => column.name.toLowerCase() === update[2].toLowerCase());
    const whereAt = table.columns.findIndex((column) => column.name.toLowerCase() === update[4].toLowerCase());
    const setValue = parseLiteral(update[3]);
    const whereValue = parseLiteral(update[5]);
    if (setAt < 0 || whereAt < 0 || setValue === undefined || whereValue === undefined) return fail(tables, "UPDATE needs a known column and a literal.");
    if (table.columns[setAt].pk) return fail(tables, "This lab does not change a primary key.");
    let count = 0;
    for (const row of table.rows) {
      if (row[whereAt] === whereValue) {
        row[setAt] = setValue;
        count += 1;
      }
    }
    return { ok: true, message: `Query OK, ${count} row${count === 1 ? "" : "s"} updated.`, tables: next, columns: table.columns.map((column) => column.name), rows: table.rows };
  }
  const remove = /^delete\s+from\s+([A-Za-z][A-Za-z0-9]*)\s+where\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*('[^']*'|-?\d+)\s*$/i.exec(sql);
  if (remove) {
    const table = next.find((item) => item.name.toLowerCase() === remove[1].toLowerCase());
    if (!table) return fail(tables, "That table is not in this lab.");
    const whereAt = table.columns.findIndex((column) => column.name.toLowerCase() === remove[2].toLowerCase());
    const whereValue = parseLiteral(remove[3]);
    if (whereAt < 0 || whereValue === undefined) return fail(tables, "DELETE needs a known column and a literal.");
    const before = table.rows.length;
    table.rows = table.rows.filter((row) => row[whereAt] !== whereValue);
    const count = before - table.rows.length;
    return { ok: true, message: `Query OK, ${count} row${count === 1 ? "" : "s"} deleted.`, tables: next, columns: table.columns.map((column) => column.name), rows: table.rows };
  }
  const create = /^create\s+table\s+([A-Za-z][A-Za-z0-9]*)\s*\((.+)\)\s*$/i.exec(sql);
  if (create) {
    if (next.some((table) => table.name.toLowerCase() === create[1].toLowerCase())) return fail(tables, "That table already exists.");
    const columns: SqlColumn[] = [];
    for (const part of splitArgs(create[2])) {
      const match = /^([A-Za-z][A-Za-z0-9]*)\s+([A-Za-z]+)(\s+primary\s+key)?$/i.exec(part.trim());
      if (!match) return fail(tables, "Each column needs a name and a type, and at most one PRIMARY KEY.");
      columns.push({ name: match[1], type: match[2].toUpperCase(), pk: Boolean(match[3]) });
    }
    if (columns.filter((column) => column.pk).length > 1) return fail(tables, "This lab allows one primary key column.");
    next.push({ name: create[1], columns, rows: [] });
    return { ok: true, message: `Query OK, table ${create[1]} created.`, tables: next, columns: [], rows: [] };
  }
  return fail(tables, "This lab runs SELECT, INSERT, UPDATE, DELETE, and CREATE TABLE. Check the shape of the statement.");
}

export type Patron = { StudentID: number; Name: string; Class: string };

export const patrons: Patron[] = [
  { StudentID: 101, Name: "Alex Mercer", Class: "10A" },
  { StudentID: 102, Name: "Elena Rostova", Class: "10A" },
  { StudentID: 103, Name: "Sam Okonkwo", Class: "10B" },
];

export function selectClass(rows: Patron[], value: string): Patron[] {
  return rows.filter((row) => row.Class === value);
}

export function projectNames(rows: Patron[]): { StudentID: number; Name: string }[] {
  return rows.map((row) => ({ StudentID: row.StudentID, Name: row.Name }));
}

export type Loan = { LoanID: string; StudentID: number; BookID: string };

export const loans: Loan[] = [
  { LoanID: "L1", StudentID: 101, BookID: "B9" },
  { LoanID: "L2", StudentID: 101, BookID: "B4" },
];

export function innerLoans(): { Name: string; LoanID: string; BookID: string }[] {
  const out: { Name: string; LoanID: string; BookID: string }[] = [];
  for (const patron of patrons) {
    for (const loan of loans) {
      if (loan.StudentID === patron.StudentID) out.push({ Name: patron.Name, LoanID: loan.LoanID, BookID: loan.BookID });
    }
  }
  return out;
}

export function leftLoans(): { Name: string; LoanID: string | null; BookID: string | null }[] {
  const out: { Name: string; LoanID: string | null; BookID: string | null }[] = [];
  for (const patron of patrons) {
    const matched = loans.filter((loan) => loan.StudentID === patron.StudentID);
    if (matched.length === 0) out.push({ Name: patron.Name, LoanID: null, BookID: null });
    for (const loan of matched) out.push({ Name: patron.Name, LoanID: loan.LoanID, BookID: loan.BookID });
  }
  return out;
}

export function hashJoinPlan(): string[] {
  return [
    "Build a hash table on Loans.StudentID (the smaller side).",
    "Probe that table with each Students.StudentID.",
    "Keep a match for an inner join. Keep the student and null loan columns for a left join.",
  ];
}

export type OrderLine = { orderId: number; customer: string; city: string; sku: string };

export const orderLines: OrderLine[] = [
  { orderId: 1, customer: "Harbor Press", city: "Hull", sku: "B1" },
  { orderId: 2, customer: "Harbor Press", city: "Hull", sku: "B2" },
];

export function decomposeOrders(lines: OrderLine[]): { customers: { customer: string; city: string }[]; orders: { orderId: number; customer: string; sku: string }[] } {
  const customers: { customer: string; city: string }[] = [];
  for (const line of lines) {
    if (!customers.some((customer) => customer.customer === line.customer)) customers.push({ customer: line.customer, city: line.city });
  }
  return {
    customers,
    orders: lines.map((line) => ({ orderId: line.orderId, customer: line.customer, sku: line.sku })),
  };
}

export function seekPath(key: number): { hops: string[]; seeks: number; scans: number } {
  const hops = ["Root [ 50 | 100 ]"];
  if (key < 50) hops.push("[ 20 | 35 ]");
  else if (key <= 100) hops.push("[ 65 | 80 ]");
  else hops.push("[ 120 | 150 ]");
  return { hops, seeks: hops.length, scans: 1_000_000 };
}

export function transfer(balanceA: number, balanceB: number, amount: number, crash: boolean): { a: number; b: number; committed: boolean; note: string } {
  if (amount <= 0 || amount > balanceA) {
    return { a: balanceA, b: balanceB, committed: false, note: "The transfer did not start. The amount must be within the balance of account A." };
  }
  if (crash) {
    return { a: balanceA, b: balanceB, committed: false, note: "The server stopped mid-transfer. The write-ahead log rolled both balances back." };
  }
  return { a: balanceA - amount, b: balanceB + amount, committed: true, note: "Committed. Both sides of the transfer are recorded." };
}

export type Note = { id: string; title: string; text: string };

export const harborNotes: Note[] = [
  { id: "D1", title: "Harbor loans", text: "students borrow books from the harbor library" },
  { id: "D2", title: "Closed stacks", text: "reference books stay in the closed stack" },
  { id: "D3", title: "Audio desk", text: "unstructured audio of story hour" },
];

const STOP = new Set(["a", "an", "the", "of", "from", "in", "and", "to"]);

export function retrieve(query: string, notes: Note[] = harborNotes): Note[] {
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term && !STOP.has(term));
  if (terms.length === 0) return [];
  return notes.filter((note) => {
    const words = new Set(note.text.toLowerCase().split(/[^a-z0-9]+/));
    return terms.every((term) => words.has(term));
  });
}

export type Triple = { s: string; p: string; o: string };

export const harborTriples: Triple[] = [
  { s: "copy:1", p: "copyOf", o: "work:ledger" },
  { s: "copy:2", p: "copyOf", o: "work:ledger" },
  { s: "account:7", p: "borrowed", o: "copy:1" },
];

export function matchTriples(pattern: { s: string; p: string; o: string }, triples: Triple[] = harborTriples): Triple[] {
  const blank = (want: string, have: string) => want.trim() === "" || want.trim() === "*" || want === have;
  return triples.filter((triple) => blank(pattern.s, triple.s) && blank(pattern.p, triple.p) && blank(pattern.o, triple.o));
}

export function quorumRead(up: number): { ok: boolean; note: string } {
  const live = Math.max(0, Math.min(3, Math.floor(up)));
  if (live >= 2) return { ok: true, note: `${live} of 3 copies answered. The quorum of 2 is met. The loan count is 2.` };
  return { ok: false, note: `${live} of 3 copies answered. A quorum of 2 is not met, so the read stops.` };
}

export function junctionReady(choice: { junction: string; studentFk: boolean; bookFk: boolean }): boolean {
  return choice.junction === "Loans" && choice.studentFk && choice.bookFk;
}
