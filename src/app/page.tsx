"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyIcon, FileIcon, UploadIcon } from "@radix-ui/react-icons";
import { BotIcon, CheckCheckIcon } from "lucide-react";
import { useChat } from "ai/react";
import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

export default function Component() {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
    isLoading,
  } = useChat({ api: "/api/minute" });

  const handleRun = async (e: FormEvent) => {
    setMessages([]);
    handleSubmit(e);
    setInput(input);
  };

  const handleCopy = () => {
    if (messages.length) {
      navigator.clipboard.writeText(messages[0].content);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  return (
    <form
      onSubmit={handleRun}
      className="w-full max-w-3xl mx-auto py-8 px-12 md:px-10 mb-5"
    >
      <div className="grid gap-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AI議事録くん</h1>
        </div>
        <div className="flex justify-center">
          <img src="OIG4.jpg" className="w-32 md:w-48" />
        </div>
        <Tabs defaultValue="paste" className="w-full">
          <div className="flex justify-center">
            <TabsList className="border-b border-muted">
              <TabsTrigger
                value="paste"
                className="py-2 px-4 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b data-[state=active]:border-primary"
              >
                貼り付け
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="py-2 px-4 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b data-[state=active]:border-primary"
              >
                アップロード
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="upload" className="pt-6">
            <div className="w-full flex flex-col items-center justify-center h-64 bg-muted rounded-md">
              <FileIcon className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                音声ファイルかテキストファイルを入れてね(準備中)
              </p>
              <Button className="mt-4">
                <UploadIcon className="w-4 h-4 mr-2" />
                アップロード
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="paste" className="pt-6">
            <Textarea
              placeholder="議事録の文字起こしを入れてね"
              className="w-full h-64 p-4 bg-muted rounded-md"
              value={input}
              onChange={handleInputChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-center my-3">
        <Button className="font-bold" type="submit" disabled={isLoading}>
          <BotIcon className="me-2" />
          {isLoading ? "生成中..." : "実行！"}
        </Button>
      </div>

      <div className="flex mt-5 mb-3 justify-between items-center">
        <h2 className="text-xl font-bold">結果</h2>
        <Button
          disabled={messages.length <= 1}
          variant="outline"
          type="button"
          onClick={handleCopy}
        >
          {isCopied ? (
            <>
              <CheckCheckIcon className="w-4 h-4 mr-2" />
              完了！
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 mr-2" />
              コピー
            </>
          )}
        </Button>
      </div>
      <Card className="min-h-36 max-h-xl overflow-scroll rounded-sm px-2 py-2">
        <Markdown remarkPlugins={[remarkGfm]}>
          {messages.length && messages[messages.length - 1].role === "assistant"
            ? messages[messages.length - 1].content
            : ""}
        </Markdown>
      </Card>
    </form>
  );
}
