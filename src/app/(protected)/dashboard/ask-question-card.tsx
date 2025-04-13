'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project';
import Image from 'next/image';
import React from 'react';
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import MDEditor from "@uiw/react-md-editor"
import CodeReferences from './code-references';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';

const AskQuestionCard = () => {
    const { project } = useProject();
    const [question, setQuestion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string, sourceCode: string, summary: string }[]>([]);
    const [answers, setAnswers] = React.useState('');
    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswers('')
        setFilesReferences([])
        e.preventDefault();
        if (!project?.id) return
        setLoading(true)

        const { output, filesReferences } = await askQuestion(question, project.id)
        setOpen(true);
        setFilesReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswers(ans => ans + delta)
            }
        }
        setLoading(false)
    }
    const refetch = useRefetch()

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[80vw]'>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <DialogTitle>
                                <Image src={'/vercel.svg'} width={40} height={40} alt="Project Image" />
                            </DialogTitle>
                            <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={() => {
                                saveAnswer.mutate({
                                    projectId: project!.id,
                                    question,
                                    answer: answers,
                                    filesReferences
                                }, {
                                    onSuccess: () => {
                                        toast.success("Answer saved successfully")
                                        refetch()
                                    },
                                    onError: () => {
                                        toast.error("Error saving answer")
                                    }
                                })
                            }}>
                                Save Answer
                            </Button>
                        </div>
                    </DialogHeader>
                    <MDEditor.Markdown source={answers} className='max-w-[70vw] h-full max-h-[40vh] overflow-scroll' />
                    <div className='h-4'></div>
                    <CodeReferences filesReferences={filesReferences} />
                    <Button type='button' onClick={() => { setOpen(false) }}>Close</Button>
                    <p>Your question has been submitted!</p>
                </DialogContent>
            </Dialog>
            <Card className='relative w-full'>
                <CardHeader>
                    <CardTitle>Ask a question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea
                            placeholder="Which file should I edit to change the home page?"
                            className='resize-none'
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                        <div className='h-4'></div>
                        <Button type='submit' disabled={loading}>
                            Ask AI
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AskQuestionCard;
