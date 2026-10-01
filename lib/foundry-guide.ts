export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  points?: string[];
};

export type GuideChapter = {
  id: string;
  title: string;
  sections: GuideSection[];
};

export const FOUNDRY_GUIDE: readonly GuideChapter[] = [
  {
    id: "user-guide",
    title: "User guide",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        paragraphs: [
          "Foundry is the drawing desk in Keel. A project is one JSON file. A diagram is one sheet in that file. A shape is a named box, and a link joins two shapes.",
          "The desk is for a small team sharing one drawing, a person who models a system and then sketches code from it, and a class. The Harbor Library cases on Keel stay fictional.",
        ],
        points: [
          "Open the page in a browser on macOS, Windows, or Linux. The page you load is the class build.",
          "The language row has UML 2, ERD, Dataflow, Flowchart, Mind map, C4, SysML, BPMN, Wireframe, AWS, GCP, Azure, and AI design.",
          "UML 2 is the name of that drawing set. The desk draws those shapes. It does not certify that a sheet meets a UML standard.",
          "One project holds several diagrams. The desk is one page.",
          "Light theme and Dark theme follow the page theme.",
          "The browser draws the page at the display resolution. There is no separate pixel-ratio control.",
          "Modeling sketches Java, C#, C++, Python, PHP, JavaScript, TypeScript, Ruby, SQL, and GraphQL as local text.",
          "Extensions are JavaScript kept in this browser.",
          "Check runs when you open a drawing, export it, or choose Check sheet.",
          "HTML notes download from Modeling. Print uses the browser at A4 or Letter.",
          "Load the page again to use the class build that is running. The desk does not update itself.",
        ],
      },
      {
        id: "basic-concepts",
        title: "Basic Concepts",
        paragraphs: [
          "Select a shape to edit its name. Connect Arrow, then click two shapes, to add a link. The toolbox on the current language names the shapes and the link kinds for that sheet.",
          "A UML, wireframe, or cloud shape is a drawing. It does not show milliseconds or requests per second. A dataflow service can be run from the parts rail when you are signed in. A link on a dataflow sheet stays a plain wire so the flow can move.",
        ],
      },
      {
        id: "managing-project",
        title: "Managing Project",
        paragraphs: [
          "Open reads a JSON file saved from this desk. Export JSON writes the project, including every diagram, with specVersion 2.0-keel-foundry. Clear empties the open sheet. Blank canvas empties it and returns the desk to a free drawing. Other diagrams in the file stay.",
          "The file is the project. Pass that file to the command line when you want a sketch, HTML notes, an SVG, or the same check the page runs.",
        ],
      },
      {
        id: "managing-diagrams",
        title: "Managing Diagrams",
        paragraphs: [
          "New diagram adds an empty sheet and keeps the language you are on. The name field renames the open sheet. The strip of sheet buttons switches diagrams, and Commands can find a diagram by name.",
          "Choosing a language on the top row stores the open sheet and opens that language. On UML 2, the UML diagram menu switches Class, Use case, Sequence, Activity, Component, Deployment, State machine, Object, and Package.",
        ],
      },
      {
        id: "diagram-editor",
        title: "Diagram Editor",
        paragraphs: [
          "The canvas is the editor. Select / Move drags a shape. Connect Arrow draws a link. The cut tool removes a link. Fit brings the drawing into view. Text adds a text shape. Parts, on the full-page desk, opens the rail of tools for the current language.",
          "Full page is how Foundry opens. Exit full page returns to the page with the class shell. The drawing stays in this browser until you export it.",
        ],
      },
      {
        id: "editing-elements",
        title: "Editing Elements",
        paragraphs: [
          "Click a shape and edit Node Label. A drawing shape also has Stereotype, Attributes, and Operations. The attribute box is named Literals, Internal, Slots, or Operands on an enumeration, a state, an object, or a fragment. Double-click is not required: the fields sit beside the canvas.",
          "Delete or Backspace removes the selection. Command or Ctrl with D duplicates it. Undo and Redo are on Commands and on the keyboard. Relationships lists the lines on the selected shape. Unconnected lists shapes with no line, and Remove takes one off the sheet.",
        ],
      },
      {
        id: "formatting-elements",
        title: "Formatting Elements",
        paragraphs: [
          "A drawing shape has Visibility, isAbstract, isFinalSpecialization, isLeaf, and isActive. Font is Canvas, Arial, Georgia, or Monospace. Line is Ink, Copper, or Amber. Alignment is Left, Center, or Right. Line style is Solid or Dashed.",
          "These fields change the selected shape. They do not change the rest of the sheet.",
        ],
      },
      {
        id: "annotation-elements",
        title: "Annotation Elements",
        paragraphs: [
          "Note adds a note shape. The documentation field on a selected shape accepts Markdown, including a table, a task list, and strikethrough. Modeling previews that note. A script tag and a javascript: link stay text in the preview and in the HTML download.",
          "Copy name puts the selected shape's name on the clipboard when the browser allows it, and always shows the name in a status toast.",
        ],
      },
      {
        id: "managing-extensions",
        title: "Managing Extensions",
        paragraphs: [
          "Extensions opens the panel. Give the script a name, paste it, and save. A saved extension can be turned on or deleted. This browser keeps at most 12 extensions, each at most 20,000 characters, under keel.foundry.extensions.v1.",
          "An enabled command appears in Commands. An enabled shape appears in the toolbox for the languages it names. The script runs in a sandbox frame on this page. The desk does not load an extension from a web address.",
        ],
      },
      {
        id: "user-interface",
        title: "User Interface",
        paragraphs: [
          "The language row picks the drawing set. The toolbar holds the editor, the sheet strip, Extensions, AI desk, Mermaid, Commands, Modeling, Guide, and Help. Model explorer lists the shapes on the open sheet.",
          "The toolbar scrolls when it is taller than the reserved band, so the canvas stays on the page. Light theme and Dark theme are in Commands and in Modeling.",
        ],
      },
      {
        id: "live-share",
        title: "Live share",
        paragraphs: [
          "Share, in Modeling, follows a room name across Foundry tabs in this browser. Type a room such as harbor, then turn Share on in each tab. A change on one tab appears on the others.",
          "The drawing does not leave this browser. The desk does not download a share tool, and it does not reach GitHub.",
        ],
      },
      {
        id: "cli",
        title: "CLI (Command Line Interface)",
        paragraphs: [
          "From the project directory, run node --experimental-strip-types scripts/foundry-cli.mjs drawing.json followed by one mode. --check prints the same notes as Check sheet. --code takes java, cs, cpp, py, php, js, ts, ruby, sql, or graphql. --html writes notes. --svg writes the first sheet as an image.",
          "A file that is not a Foundry drawing exits 2. A check that finds a note exits 1. A clear check exits 0 and prints Checked. No notes. The sketches are text. They are not compiled, and the command does not read a source file back into the drawing.",
        ],
      },
      {
        id: "validation-rules",
        title: "Validation Rules",
        paragraphs: [
          "Check looks for a blank name, a repeated name, two shapes that share an id, and a link whose end is missing. It keeps the first 40 notes. A link from a shape back to itself is allowed. The check does not refuse the file.",
          "Open, Export JSON, and Check sheet schedule the check. The page shows Checking this sheet… and then Checked. No notes. or a count of notes. Give the shape a name, rename the duplicate, or reconnect the link, then check again.",
        ],
      },
      {
        id: "keyboard-shortcuts",
        title: "Keyboard Shortcuts",
        paragraphs: [
          "These shortcuts work when the focus is not in a text field, except Undo, Redo, and the command with Y, which also work while typing.",
        ],
        points: [
          "Command or Ctrl with Z undoes. Add Shift to redo. Command or Ctrl with Y also redoes.",
          "Command or Ctrl with K opens Commands. Command or Ctrl with Shift and F opens Commands. Escape closes Commands and leaves connect mode.",
          "Command or Ctrl with D duplicates the selection. Delete or Backspace removes it.",
          "Command or Ctrl with F stays with the browser. The desk find is Commands.",
        ],
      },
      {
        id: "touch-bar",
        title: "Touch Bar (MacBook)",
        paragraphs: [
          "Use the keyboard shortcuts and the toolbar. The desk leaves the MacBook Touch Bar alone.",
        ],
      },
      {
        id: "customization",
        title: "Customization",
        paragraphs: [
          "Light theme and Dark theme are stored with the page theme. Print can use A4 or Letter before you print. On a wireframe sheet, Sketch draws the boxes with a hand-drawn stroke.",
          "An extension can add a shape or a command. It cannot add a theme, a key, or a menu. Load the page again to use the class build that is running.",
        ],
      },
      {
        id: "mermaid",
        title: "Mermaid Support",
        paragraphs: [
          "Mermaid reads a short description on this page and places shapes on the open sheet. It accepts flowchart or graph, classDiagram, erDiagram, and sequenceDiagram. The description can be at most 4,000 characters, 12 shapes, and 16 links.",
          "The read happens in the browser. The desk does not send the description to a Mermaid host. Place a screen drops the Harbor Library wireframe and switches the sheet to Wireframe.",
        ],
      },
      {
        id: "mcp",
        title: "AI integration via MCP",
        paragraphs: [
          "AI desk calls the Foundry MCP server at /api/foundry/mcp. Draw diagram, Suggest, and Sketch code send the open sheet. The tools are list_desk, suggest_diagram, generate_diagram, and generate_code.",
          "A signed-in learner who allowed the live tutor can receive a model drawing or a code sketch. Otherwise the desk answers from the sheet. The key stays on the class server. The server does not reach GitHub, CI, Docker, or a cloud account.",
        ],
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting",
        paragraphs: [
          "If Open says the file is not a Foundry drawing, choose a JSON file saved from this lab. If Check names a blank or repeated shape, edit that name and check again. If a link points at a missing shape, reconnect it or remove it.",
          "If an extension says the command did not finish, look for a loop and save again. If AI desk cannot reach the server, try the action again. If the toolbar covers the canvas, scroll the toolbar. Questions about the class go to Class.",
        ],
      },
    ],
  },
  {
    id: "uml",
    title: "Working with UML Diagrams",
    sections: [
      {
        id: "class-diagram",
        title: "Class Diagram",
        paragraphs: [
          "Choose UML 2, then Class. Classes (basic) has Class, Interface, and the association, aggregation, composition, dependency, generalization, and realization links. Classes (advanced) has Enumeration and Data type.",
        ],
      },
      {
        id: "package-diagram",
        title: "Package Diagram",
        paragraphs: [
          "Choose UML 2, then Package. The toolbox has Package, Model, and Frame. A package can hold the name of a group of classes. The sheet does not enforce what is nested inside it.",
        ],
      },
      {
        id: "composite-structure",
        title: "Composite Structure Diagram",
        paragraphs: [
          "Stay on the Class sheet. Composite structure has Component, Port, and the assembly link. There is no separate composite-structure menu.",
        ],
      },
      {
        id: "object-diagram",
        title: "Object Diagram",
        paragraphs: [
          "Choose UML 2, then Object. Add an Object and write the slots in the Slots field. Underline on the name marks the object.",
        ],
      },
      {
        id: "component-diagram",
        title: "Component Diagram",
        paragraphs: [
          "Choose UML 2, then Component. The toolbox has Component, Interface, Port, Artifact, Provided, and Required. Assembly and Realization are the links for a provided interface.",
        ],
      },
      {
        id: "deployment-diagram",
        title: "Deployment Diagram",
        paragraphs: [
          "Choose UML 2, then Deployment. Add a Node, a Device, or an Environment, and place a Component or an Artifact on the same sheet.",
        ],
      },
      {
        id: "use-case-diagram",
        title: "Use Case Diagram",
        paragraphs: [
          "Choose UML 2, then Use case. Add an Actor, a Use case, and a Boundary. Connect them with the link kinds on that sheet.",
        ],
      },
      {
        id: "sequence-diagram",
        title: "Sequence Diagram",
        paragraphs: [
          "Choose UML 2, then Sequence. A Lifeline is one participant. A Fragment can be marked alt in its stereotype, with operands and guards in the fields. An Actor can stand at the end of a lifeline.",
        ],
      },
      {
        id: "communication-diagram",
        title: "Communication Diagram",
        paragraphs: [
          "There is no communication sheet. Draw the same participants on Sequence. A lifeline names the participant, and a link label can carry the message.",
        ],
      },
      {
        id: "timing-diagram",
        title: "Timing Diagram",
        paragraphs: [
          "There is no timing sheet. Use State machine for the states of one life, or Sequence for an ordered exchange.",
        ],
      },
      {
        id: "interaction-overview",
        title: "Interaction Overview Diagram",
        paragraphs: [
          "There is no interaction-overview sheet. Use Activity. An action name can point at the sequence it stands for.",
        ],
      },
      {
        id: "statechart",
        title: "Statechart Diagram",
        paragraphs: [
          "Choose UML 2, then State machine. The toolbox has State, Initial, Final, Choice, History, and Fork. Internal activities go in the Internal field.",
        ],
      },
      {
        id: "activity-diagram",
        title: "Activity Diagram",
        paragraphs: [
          "Choose UML 2, then Activity. Add Initial, Action, Decision, Fork, Flow final, Final, Object, and Swimlane. Transition joins the steps. Object flow joins an object to an action.",
        ],
      },
      {
        id: "information-flow",
        title: "Information Flow Diagram",
        paragraphs: [
          "There is no information-flow sheet. On SysML, Item flow names what moves between blocks. On Dataflow, a wire joins services.",
        ],
      },
      {
        id: "profile-diagram",
        title: "Profile Diagram",
        paragraphs: [
          "There is no profile sheet. Write a stereotype on the selected shape. The desk does not keep a separate stereotype catalog.",
        ],
      },
    ],
  },
  {
    id: "sysml",
    title: "Working with SysML Diagrams",
    sections: [
      {
        id: "requirement-diagram",
        title: "Requirement Diagram",
        paragraphs: [
          "Choose SysML. Requirements has Requirement, Constraint, and the Satisfy, Trace, Allocate, and Dependency links.",
        ],
      },
      {
        id: "block-definition",
        title: "Block Definition Diagram",
        paragraphs: [
          "On the same SysML sheet, Structure has Block, Port, and Value. Composition joins a block to its parts.",
        ],
      },
      {
        id: "internal-block",
        title: "Internal Block Diagram",
        paragraphs: [
          "Use Block and Port on the SysML sheet for the inside of a block. Item flow names what passes between ports. There is no second SysML menu.",
        ],
      },
      {
        id: "parametric-diagram",
        title: "Parametric Diagram",
        paragraphs: [
          "Add a Constraint and connect it with Satisfy, Trace, or Allocate. The constraint text goes in the name and the documentation field. There is no separate parametric sheet.",
        ],
      },
    ],
  },
  {
    id: "additional",
    title: "Working with Additional Diagrams",
    sections: [
      {
        id: "erd",
        title: "Entity-Relationship Diagram",
        paragraphs: [
          "Choose ERD. Entities has Entity, Weak entity, and Junction. Attributes has Attribute. Relationships has Relationship and the crow's foot, identifying, and non-identifying links. A crow's foot reads the multiplicity: one bar, an optional circle, or a foot.",
        ],
      },
      {
        id: "flowchart",
        title: "Flowchart Diagram",
        paragraphs: [
          "Choose Flowchart. Flow has Start, Process, Decision, Input, Document, and End. The flow link joins them.",
        ],
      },
      {
        id: "dataflow",
        title: "Data Flow Diagram",
        paragraphs: [
          "Choose Dataflow. Services are Client, Gateway, Auth, Compute, Cache, Database, Queue, CI, and Telemetry. The connector is a dataflow wire. These parts can run. Leave the link kind empty so the flow keeps moving.",
        ],
      },
      {
        id: "c4",
        title: "C4 Diagram",
        paragraphs: [
          "Choose C4. Model has Person, System, Container, Component, and External. The relationship link labels the use.",
        ],
      },
      {
        id: "bpmn",
        title: "BPMN Diagram",
        paragraphs: [
          "Choose BPMN. Events has Start and End. Activities has Task and Subprocess. Gateways has Gateway. Flows has Sequence flow and Message flow.",
        ],
      },
      {
        id: "mindmap",
        title: "Mind map diagram",
        paragraphs: [
          "Choose Mind map. Topics has Topic and Idea. The branch link joins a topic to an idea.",
        ],
      },
      {
        id: "wireframe",
        title: "Wireframe Diagram",
        paragraphs: [
          "Choose Wireframe. Screens has Screen, Navigation, and Heading. Controls has Button, Field, Image, and List. Place a screen drops Library, Find a book, Card number, and Search. Sketch turns on the hand-drawn stroke for those boxes.",
        ],
      },
      {
        id: "aws",
        title: "AWS Architecture Diagram",
        paragraphs: [
          "Choose AWS. The boxes are named EC2, Lambda, S3, RDS, VPC, Load balancer, API Gateway, CloudFront, SQS, and IAM. They are named boxes. The link is the same connector used on the other architecture sheets.",
        ],
      },
      {
        id: "gcp",
        title: "GCP Architecture Diagram",
        paragraphs: [
          "Choose GCP. The boxes are named Compute Engine, Cloud Run, Function, Cloud Storage, Cloud SQL, VPC, Load balancer, CDN, Pub/Sub, and IAM. They are named boxes.",
        ],
      },
      {
        id: "azure",
        title: "Azure Architecture Diagram",
        paragraphs: [
          "Choose Azure. The boxes are named Virtual machine, Function, Blob storage, Azure SQL, Virtual network, Load balancer, API Management, CDN, Queue, and Entra ID. They are named boxes.",
        ],
      },
      {
        id: "ai-design",
        title: "AI design diagram",
        paragraphs: [
          "Choose AI design. The sheet has Prompt, Model, Dataset, Embedding, Retriever, Agent, Tool, Guard, Evaluation, and Serving, with Calls, Grounds, Guards, Reads, Trains, and Serves.",
        ],
      },
    ],
  },
  {
    id: "developing",
    title: "Developing Extensions",
    sections: [
      {
        id: "ext-start",
        title: "Getting Started",
        paragraphs: [
          "Open Extensions and save a script that calls keel.tool or keel.command. The built-in example adds Stamp on UML 2, Flowchart, and ERD, and a Number shapes command.",
          "A shape id looks like x-stamp and is at most 18 characters. One extension can add 12 shapes and 8 commands. The script runs in a sandbox frame that does not share this page's origin.",
        ],
      },
      {
        id: "ext-commands",
        title: "Commands",
        paragraphs: [
          "keel.command takes a name and a function. The function receives the open diagram and returns a patch, or nothing. After you save and enable the extension, the name appears in Commands.",
        ],
      },
      {
        id: "ext-menus",
        title: "Menus",
        paragraphs: [
          "A command is a row in Commands and in the Extensions panel. An extension does not add a menu of its own.",
        ],
      },
      {
        id: "ext-keymaps",
        title: "Keymaps",
        paragraphs: [
          "An extension does not bind a key. Use the keyboard shortcuts in this guide, and run the command from Commands.",
        ],
      },
      {
        id: "ext-toolbox",
        title: "Toolbox",
        paragraphs: [
          "keel.tool takes an id, a name, a glyph, and languages. languages can be uml, erd, flowchart, a family such as class, or * for every language. group names the toolbox band. glyph is a shape the desk already draws, such as class, art, action, or actor.",
        ],
      },
      {
        id: "ext-access",
        title: "Accessing Elements",
        paragraphs: [
          "The diagram argument has language, family, selectedNodeId, nodes, and connections. Each node has id, type, label, x, y, w, h, and stereotype. Each connection has id, from, to, kind, and label. The command sees the whole sheet.",
        ],
      },
      {
        id: "ext-modify",
        title: "Creating, Deleting and Modifying Elements",
        paragraphs: [
          "Return updateNodes, deleteNodes, addNodes, deleteConnections, and addConnections. An update needs an id on the sheet and may set label, stereotype, attributes, x, and y. A removal is an id. An added shape needs a type the desk knows, and an optional key of a short word. A link needs from and to. Those ends can be an id already on the sheet or a key added in the same patch.",
          "One command can update or remove up to 200 shapes, add up to 40 shapes, remove up to 200 links, and add up to 40 links. A dataflow link should leave kind empty.",
        ],
      },
      {
        id: "ext-selection",
        title: "Working with Selections",
        paragraphs: [
          "selectedNodeId is the selected shape, or empty when nothing is selected. Read that id from diagram.nodes when the command should change only the selection. The desk does not pass a multi-selection.",
        ],
      },
      {
        id: "ext-preferences",
        title: "Defining Preferences",
        paragraphs: [
          "An extension does not store a preference. Light theme and Dark theme belong to the page. Keep any choice in the script itself.",
        ],
      },
      {
        id: "ext-dialogs",
        title: "Using Dialogs",
        paragraphs: [
          "An extension does not open a dialog. Return a patch. The Extensions panel shows the summary, or the reason the patch was refused, and asks you to change the script and save again.",
        ],
      },
      {
        id: "ext-registry",
        title: "Registering to Extension Registry",
        paragraphs: [
          "Save the script in this browser. It stays in local storage under keel.foundry.extensions.v1. The desk does not submit an extension to a registry, and it does not install one from the web.",
        ],
      },
    ],
  },
];

export function guideSections(): GuideSection[] {
  return FOUNDRY_GUIDE.flatMap((chapter) => chapter.sections);
}
