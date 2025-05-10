import { type MarkdownFileInfo } from "obsidian";
import { PluginValue } from '@codemirror/view';
import LinearPlugin from "main";
import { HexColor } from "types/colors";

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
  labels: {
    nodes: Labels[]
  },
  state: {
      color: HexColor<string>;
      name: string;
      type: string;
  }
  assignee: {
    name: string;
    displayName: string;
    avatarUrl: string;
  }
}

type Labels = {
  id: string;
  name: string;
  color: HexColor<string>;
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

declare global {
  var CacheHash: string;
}