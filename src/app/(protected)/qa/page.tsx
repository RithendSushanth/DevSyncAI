"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import useProject from "@/hooks/use-project"
import { api } from "@/trpc/react"
import React from "react"
import AskQuestionCard from "../dashboard/ask-question-card"
import MDEditor from "@uiw/react-md-editor"
import CodeReferences from "../dashboard/code-references"
import { ScrollArea } from "@/components/ui/scroll-area"

const QAPage = () => {
  const { projectId } = useProject()
  const { data: questions } = api.project.getQuestions.useQuery({ projectId: projectId! })
  const [questionIndex, setQuestionIndex] = React.useState(0)
  const question = questions?.[questionIndex]

  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
        {questions?.map((question, index) => {
          return (
            <SheetTrigger key={question.id} onClick={() => setQuestionIndex(index)} className="w-full">
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border w-full text-left">
                <img
                  className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
                  src={question.user.imageUrl ?? ""}
                  alt="Question Avatar"
                  height={30}
                  width={30}
                />
                <div className="flex-col flex flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 line-clamp-1 text-lg font-medium flex-1">{question.question}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {question.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-500 line-clamp-2 text-sm">{question.answer}</p>
                </div>
              </div>
            </SheetTrigger>
          )
        })}
      </div>

      {question && (
        <SheetContent className="sm:max-w-[80vw] p-0 flex flex-col">
          <div className="p-6 border-b">
            <SheetHeader>
              <SheetTitle className="text-xl">{question.question}</SheetTitle>
            </SheetHeader>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div className="markdown-content">
                <MDEditor.Markdown source={question.answer} />
              </div>

              <div className="code-references">
                <CodeReferences filesReferences={(question.filesReferences ?? []) as any} />
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default QAPage
