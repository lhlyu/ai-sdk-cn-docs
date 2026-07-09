import type { ReactNode } from 'react';
import Note from './components/Note';
import Snippet from './components/Snippet';
import InstallPackages from './components/InstallPackages';
import Tabs from './components/Tabs';
import Tab from './components/Tab';
import PropertiesTable from './components/PropertiesTable';
import IndexCards from './components/IndexCards';
import ExampleLinks from './components/ExampleLinks';
import Browser from './components/Browser';
import MDXImage from './components/MDXImage';
import ButtonLink from './components/ButtonLink';
import Card from './components/Card';
import InlinePrompt from './components/InlinePrompt';
import GithubLink from './components/GithubLink';
import Check from './components/Check';
import Cross from './components/Cross';
import Templates from './components/Templates';
import WeatherSearch from './components/WeatherSearch';
import {
  OfficialModelCards,
  CommunityModelCards,
  QuickstartFrameworkCards,
  PreviewSwitchProviders,
  Support,
} from './components/StaticCards';
import MissingComponent from './components/MissingComponent';
import {
  BrowserIllustration,
  CardPlayer,
  ChatGeneration,
  ObjectGeneration,
  TextGeneration,
  VercelIcon,
  WeatherCard,
} from './components/Demos';

function missing(name: string) {
  return function MissingNamedComponent({ children }: { children?: ReactNode }) {
    return <MissingComponent name={name}>{children}</MissingComponent>;
  };
}

// 官方文档中引用但尚未本地化的组件/类型名，统一渲染为占位符。
const missingNames = [
  'AI', 'AIMessageChunk', 'Array', 'AsyncIterableStream', 'BASE64_AUTH_STRING', 'BaseMessage',
  'CALL_OPTIONS', 'CHOICE', 'CONTEXT', 'CallToolResult', 'Chat', 'CompleteResult', 'ContentPart',
  'Context', 'DataContent', 'ELEMENT', 'ElicitResult', 'Embedding',
  'Experimental_RealtimeSessionConfig', 'Experimental_RealtimeToolDefinition', 'Flights',
  'GenerateTextResult', 'GeneratedFile', 'GetPromptResult', 'HarnessMessage', 'IMAGE_1', 'IMAGE_2',
  'ImageModelResponseMetadata', 'JSONObject', 'JSONValue', 'LanguageModelV4CallOptions',
  'LanguageModelV4GenerateResult', 'LanguageModelV4StreamResult', 'LanguageModelV4ToolCall',
  'ListPromptsResult', 'ListResourceTemplatesResult', 'ListResourcesResult', 'ListToolsResult',
  'MCPAppResource', 'MCPClient', 'McpToolSet', 'ModelCallStreamPart', 'ModelMessage', 'NAME',
  'OBJECT', 'PrepareStepResult', 'RESULT', 'RankingItem', 'React', 'ReactNode', 'ReadResourceResult',
  'ReadableStream', 'Record', 'RequestOptions', 'Response', 'ResponseMessage', 'SomeOtherTool',
  'SomeTool', 'SpeechModelResponseMetadata', 'StepResult', 'StopCondition', 'StreamPart',
  'StreamTextResult', 'StreamTextTransform', 'SystemMessage', 'SystemModelMessage', 'T', 'TOOLS',
  'TOOL_SCHEMAS', 'TTools', 'TextPart', 'TextStreamPart', 'ToolCall', 'ToolResult',
  'ToolResultOutput', 'ToolResultPart', 'Tools', 'TranscriptionModelResponseMetadata',
  'TypedToolCall', 'TypedToolResult', 'UIMessage', 'UIMessageChunk', 'UITools', 'VALUE',
  'VideoModelResponseMetadata', 'Warning', 'WeatherComponent', 'WorkflowAgentStreamResult',
  'YOUR_PROJECT_NAME', 'YOUR_TEAM_NAME',
];

const mdxComponents = {
  Note,
  Snippet,
  InstallPackages,
  Tabs,
  Tab,
  PropertiesTable,
  IndexCards,
  ExampleLinks,
  Browser,
  MDXImage,
  Image: MDXImage,
  ButtonLink,
  Card,
  InlinePrompt,
  GithubLink,
  Check,
  Cross,
  PreviewSwitchProviders,
  OfficialModelCards,
  Templates,
  CommunityModelCards,
  QuickstartFrameworkCards,
  WeatherSearch,
  Support,
  BrowserIllustration,
  CardPlayer,
  ChatGeneration,
  ObjectGeneration,
  TextGeneration,
  VercelIcon,
  WeatherCard,
  ...Object.fromEntries(missingNames.map((name) => [name, missing(name)])),
};

export default mdxComponents;
