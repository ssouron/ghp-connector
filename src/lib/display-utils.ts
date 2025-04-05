/**
 * Utilitaires d'affichage pour le terminal
 */

import { FormatType } from './formatters';

/**
 * Affiche le résultat formaté dans le terminal
 * Gère correctement l'affichage du JSON formaté
 *
 * @param output Le résultat formaté à afficher
 * @param formatType Le type de format utilisé
 * @param formatterOptions Les options de formatage
 */
export function displayOutput(output: string, formatType: FormatType, formatterOptions: Record<string, any>): void {
  // Pour le format JSON avec l'option pretty, nous devons afficher ligne par ligne
  if (formatType === 'json' && formatterOptions.pretty) {
    // Ne pas utiliser output.split('\n') car cela peut mal interpréter les caractères d'échappement
    // Utiliser console.log() sans arguments supplémentaires pour que le terminal interprète
    // correctement les sauts de ligne du JSON formaté
    console.log(output);
  } else {
    // Pour les autres formats, afficher normalement
    console.log(output);
  }
}
