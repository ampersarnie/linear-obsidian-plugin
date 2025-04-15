import { type MarkdownFileInfo } from "obsidian";

type CommonProps = {
    children?: any;
    className?: string;
};

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