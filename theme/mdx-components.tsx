import type { ReactNode } from 'react';
import Note from './components/Note';
import Snippet from './components/Snippet';
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
import PreviewSwitchProviders from './components/PreviewSwitchProviders';
import OfficialModelCards from './components/OfficialModelCards';
import Templates from './components/Templates';
import CommunityModelCards from './components/CommunityModelCards';
import QuickstartFrameworkCards from './components/QuickstartFrameworkCards';
import WeatherSearch from './components/WeatherSearch';
import Support from './components/Support';
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

const mdxComponents = {
  Note,
  Snippet,
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
  AI: missing('AI'),
  AIMessageChunk: missing('AIMessageChunk'),
  Array: missing('Array'),
  AsyncIterableStream: missing('AsyncIterableStream'),
  BASE64_AUTH_STRING: missing('BASE64_AUTH_STRING'),
  BaseMessage: missing('BaseMessage'),
  CALL_OPTIONS: missing('CALL_OPTIONS'),
  CHOICE: missing('CHOICE'),
  CONTEXT: missing('CONTEXT'),
  CallToolResult: missing('CallToolResult'),
  Chat: missing('Chat'),
  CompleteResult: missing('CompleteResult'),
  ContentPart: missing('ContentPart'),
  Context: missing('Context'),
  DataContent: missing('DataContent'),
  ELEMENT: missing('ELEMENT'),
  ElicitResult: missing('ElicitResult'),
  Embedding: missing('Embedding'),
  Experimental_RealtimeSessionConfig: missing('Experimental_RealtimeSessionConfig'),
  Experimental_RealtimeToolDefinition: missing('Experimental_RealtimeToolDefinition'),
  Flights: missing('Flights'),
  GenerateTextResult: missing('GenerateTextResult'),
  GeneratedFile: missing('GeneratedFile'),
  GetPromptResult: missing('GetPromptResult'),
  HarnessMessage: missing('HarnessMessage'),
  IMAGE_1: missing('IMAGE_1'),
  IMAGE_2: missing('IMAGE_2'),
  ImageModelResponseMetadata: missing('ImageModelResponseMetadata'),
  JSONObject: missing('JSONObject'),
  JSONValue: missing('JSONValue'),
  LanguageModelV4CallOptions: missing('LanguageModelV4CallOptions'),
  LanguageModelV4GenerateResult: missing('LanguageModelV4GenerateResult'),
  LanguageModelV4StreamResult: missing('LanguageModelV4StreamResult'),
  LanguageModelV4ToolCall: missing('LanguageModelV4ToolCall'),
  ListPromptsResult: missing('ListPromptsResult'),
  ListResourceTemplatesResult: missing('ListResourceTemplatesResult'),
  ListResourcesResult: missing('ListResourcesResult'),
  ListToolsResult: missing('ListToolsResult'),
  MCPAppResource: missing('MCPAppResource'),
  MCPClient: missing('MCPClient'),
  McpToolSet: missing('McpToolSet'),
  ModelCallStreamPart: missing('ModelCallStreamPart'),
  ModelMessage: missing('ModelMessage'),
  NAME: missing('NAME'),
  OBJECT: missing('OBJECT'),
  PrepareStepResult: missing('PrepareStepResult'),
  RESULT: missing('RESULT'),
  RankingItem: missing('RankingItem'),
  React: missing('React'),
  ReactNode: missing('ReactNode'),
  ReadResourceResult: missing('ReadResourceResult'),
  ReadableStream: missing('ReadableStream'),
  Record: missing('Record'),
  RequestOptions: missing('RequestOptions'),
  Response: missing('Response'),
  ResponseMessage: missing('ResponseMessage'),
  SomeOtherTool: missing('SomeOtherTool'),
  SomeTool: missing('SomeTool'),
  SpeechModelResponseMetadata: missing('SpeechModelResponseMetadata'),
  StepResult: missing('StepResult'),
  StopCondition: missing('StopCondition'),
  StreamPart: missing('StreamPart'),
  StreamTextResult: missing('StreamTextResult'),
  StreamTextTransform: missing('StreamTextTransform'),
  SystemMessage: missing('SystemMessage'),
  SystemModelMessage: missing('SystemModelMessage'),
  T: missing('T'),
  TOOLS: missing('TOOLS'),
  TOOL_SCHEMAS: missing('TOOL_SCHEMAS'),
  TTools: missing('TTools'),
  TextPart: missing('TextPart'),
  TextStreamPart: missing('TextStreamPart'),
  ToolCall: missing('ToolCall'),
  ToolResult: missing('ToolResult'),
  ToolResultOutput: missing('ToolResultOutput'),
  ToolResultPart: missing('ToolResultPart'),
  Tools: missing('Tools'),
  TranscriptionModelResponseMetadata: missing('TranscriptionModelResponseMetadata'),
  TypedToolCall: missing('TypedToolCall'),
  TypedToolResult: missing('TypedToolResult'),
  UIMessage: missing('UIMessage'),
  UIMessageChunk: missing('UIMessageChunk'),
  UITools: missing('UITools'),
  VALUE: missing('VALUE'),
  VideoModelResponseMetadata: missing('VideoModelResponseMetadata'),
  Warning: missing('Warning'),
  WeatherComponent: missing('WeatherComponent'),
  WorkflowAgentStreamResult: missing('WorkflowAgentStreamResult'),
  YOUR_PROJECT_NAME: missing('YOUR_PROJECT_NAME'),
  YOUR_TEAM_NAME: missing('YOUR_TEAM_NAME'),
};

export default mdxComponents;
