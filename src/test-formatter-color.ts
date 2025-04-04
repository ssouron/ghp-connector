/**
 * Test script for formatter colors
 * Run with: npx ts-node src/test-formatter-color.ts
 */

import { TextFormatter } from './lib/formatters/implementations/text/TextFormatter';

// Create issues with different statuses
const issues = [
  { number: 1, title: 'Open Issue', state: 'open', created_at: new Date().toISOString() },
  { number: 2, title: 'Closed Issue', state: 'closed', created_at: new Date().toISOString() },
  { number: 3, title: 'Pending Issue', state: 'pending', created_at: new Date().toISOString() },
  { number: 4, title: 'Warning Issue', state: 'warning', created_at: new Date().toISOString() },
];

// Create the formatter with color enabled
const formatter = new TextFormatter({ useColors: true });

// Test color display
console.log('\n--- TextFormatter Color Test ---\n');
console.log('Different statuses are displayed with different colors:');

// Format each issue to show different status colors
issues.forEach((issue) => {
  console.log('\n' + formatter.format(issue));
});

// Show the difference with colors disabled
const noColorFormatter = new TextFormatter({ useColors: false });
console.log('\n--- Without Colors ---\n');
issues.forEach((issue) => {
  console.log('\n' + noColorFormatter.format(issue));
});
