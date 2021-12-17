interface CommandOptionChoiceBase {
  name: string;
}

interface CommandOptionChoiceString extends CommandOptionChoiceBase {
  value: string;
}

interface CommandOptionChoiceNumber extends CommandOptionChoiceBase {
  value: number;
}

type CommandOptionChoice = CommandOptionChoiceNumber | CommandOptionChoiceString;

export interface CommandOption {
  name: string;
  type: number;
  description: string;
  required?: boolean;
  min_value?: number;
  max_value?: number;
  choices?: Array<CommandOptionChoice>;
}

export interface Command {
  type: number;
  name: string;
  description?: string;
  options?: Array<CommandOption>;
}
