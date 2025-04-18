import { type MarkdownFileInfo } from "obsidian";
import { PluginValue } from '@codemirror/view';
import LinearPlugin from "main";

type CommonProps = {
    children?: any;
    className?: string;
};

interface IssueSchema extends IssueNode {
  
}

type IssueNode = {
  id: string;
  identifier: string;
  title: string;
  url: string;
  state: {
      color: string;
      name: string;
      type: string;
  }
  assignee: {
    name: string;
    displayName: string;
    avatarUrl: string;
  }
}

interface DOMRootNodes {
  [key: string]: any;
}

interface FileData extends MarkdownFileInfo {
  data: string | null;
}

interface WidgetSpec extends PluginValue {
  Plugin: LinearPlugin;
  Cache: Cache;
}