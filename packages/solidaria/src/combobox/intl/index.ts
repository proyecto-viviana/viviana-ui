/**
 * ComboBox internationalization strings
 * Based on @react-aria/combobox/intl
 */

import type { LocalizedStrings } from '@internationalized/string';

// Import locale files
import enUS from './en-US.json' with { type: 'json' };
import esES from './es-ES.json' with { type: 'json' };

export type ComboBoxIntlStrings = {
  focusAnnouncement: string;
  countAnnouncement: string;
  selectedAnnouncement: string;
  buttonLabel: string;
  listboxLabel: string;
};

export const comboBoxIntlStrings: LocalizedStrings<keyof ComboBoxIntlStrings, string> = {
  'en-US': enUS,
  'es-ES': esES,
};
