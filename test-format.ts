import { formatOutput } from "./src/lib/formatters"; const data = { id: 123, name: "Test" }; console.log(formatOutput(data, "json", { pretty: true, indent: 4 }));
