import { JsonFormatter } from './src/lib/formatters/implementations/json/JsonFormatter';
const formatter = new JsonFormatter({ pretty: true, indent: 4 });
const data = { id: 123, name: 'Test', description: 'Description\\nWith\\nMultiple\\nLines' };
console.log(formatter.format(data));
