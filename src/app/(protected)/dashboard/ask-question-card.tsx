'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project';
import Image from 'next/image';
import React from 'react';
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from './code-references';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';
import { Brain, Save, Send, Sparkles, X } from 'lucide-react';

const AskQuestionCard = () => {
    const { project } = useProject();
    const [question, setQuestion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string, sourceCode: string, summary: string }[]>([]);
    const [answers, setAnswers] = React.useState('');
    const saveAnswer = api.project.saveAnswer.useMutation();
    const refetch = useRefetch();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project?.id || !question.trim()) return;
        
        setAnswers('');
        setFilesReferences([]);
        setLoading(true);

        try {
            const { output, filesReferences } = await askQuestion(question, project.id);
            setOpen(true);
            setFilesReferences(filesReferences);

            for await (const delta of readStreamableValue(output)) {
                if (delta) {
                    setAnswers(ans => ans + delta);
                }
            }
        } catch (error) {
            toast.error("Failed to process your question. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAnswer = () => {
        if (!project?.id) return;
        
        saveAnswer.mutate({
            projectId: project.id,
            question,
            answer: answers,
            filesReferences
        }, {
            onSuccess: () => {
                toast.success("Answer saved successfully");
                refetch();
                setOpen(false);
            },
            onError: () => {
                toast.error("Error saving answer");
            }
        });
    };

    return (
        <div className="w-full px-4">
            {/* Dialog for displaying the answer */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[90vw] w-full max-h-[95vh] flex flex-col p-0 rounded-xl">
                    <DialogHeader className="border-b p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>
                                <DialogTitle className="text-2xl font-bold">AI Response</DialogTitle>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    disabled={saveAnswer.isPending} 
                                    onClick={handleSaveAnswer}
                                    className="flex items-center gap-2 hover:bg-indigo-50 transition-colors h-12 text-lg px-6"
                                >
                                    <Save className="h-5 w-5" />
                                    {saveAnswer.isPending ? 'Saving...' : 'Save Answer'}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setOpen(false)}
                                    className="rounded-full hover:bg-gray-200 h-12 w-12"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                        <CardDescription className="mt-4 text-gray-500 text-lg">
                            <span className="font-medium">Question:</span> {question}
                        </CardDescription>
                    </DialogHeader>
                    
                    <div className="relative flex-1 overflow-hidden flex flex-col p-6">
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 rounded-xl">
                            <MDEditor.Markdown 
                                source={answers || "Generating response..."} 
                                className="prose prose-lg max-w-none" 
                            />
                        </div>
                        
                        {filesReferences.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-medium text-xl text-gray-700 mb-4 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                    <span>Code References</span>
                                </h3>
                                <CodeReferences filesReferences={filesReferences} />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-6 border-t flex justify-between items-center bg-gray-50">
                        <span className="text-sm text-gray-500">
                            Powered by AI - Responses may need verification
                        </span>
                        <Button 
                            variant="default" 
                            size="lg" 
                            onClick={() => setOpen(false)}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white h-12 px-8 text-lg"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Question input card */}
            <Card className="w-full border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden my-8">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b p-8">
                    <div className="flex items-center gap-5">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl shadow-md">
                            <Brain className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                                Ask AI Assistant
                            </CardTitle>
                            <CardDescription className="text-gray-600 text-lg mt-2">
                                Get instant help with your code repository
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-8">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="relative">
                            <Textarea
                                placeholder="How can I optimize the authentication flow? Which files handle user registration?"
                                className="resize-none min-h-[180px] p-6 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all text-lg"
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            disabled={loading || !question.trim()}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all py-8 text-xl font-medium rounded-xl"
                        >
                            {loading ? (
                                <>
                                    <div className="h-6 w-6 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
                                    <span>Processing question...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="h-6 w-6" />
                                    <span>Ask AI Assistant</span>
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                
                <CardFooter className="bg-gray-50 px-8 py-5 border-t text-center text-base text-gray-500">
                    Be specific with your questions for better results
                </CardFooter>
            </Card>
        </div>
    );
};

export default AskQuestionCard;




// 'use client'
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import useProject from '@/hooks/use-project';
// import Image from 'next/image';
// import React from 'react';
// import { askQuestion } from './actions';
// import { readStreamableValue } from 'ai/rsc';
// import MDEditor from "@uiw/react-md-editor"
// import CodeReferences from './code-references';
// import { api } from '@/trpc/react';
// import { toast } from 'sonner';
// import useRefetch from '@/hooks/use-refetch';

// const AskQuestionCard = () => {
//     const { project } = useProject();
//     const [question, setQuestion] = React.useState('');
//     const [open, setOpen] = React.useState(false);
//     const [loading, setLoading] = React.useState(false);
//     const [filesReferences, setFilesReferences] = React.useState<{ fileName: string, sourceCode: string, summary: string }[]>([]);
//     const [answers, setAnswers] = React.useState('');
//     const saveAnswer = api.project.saveAnswer.useMutation()

//     const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         setAnswers('')
//         setFilesReferences([])
//         e.preventDefault();
//         if (!project?.id) return
//         setLoading(true)

//         const { output, filesReferences } = await askQuestion(question, project.id)
//         setOpen(true);
//         setFilesReferences(filesReferences)

//         for await (const delta of readStreamableValue(output)) {
//             if (delta) {
//                 setAnswers(ans => ans + delta)
//             }
//         }
//         setLoading(false)
//     }
//     const refetch = useRefetch()

//     return (
//         <div>
//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className='sm:max-w-[80vw]'>
//                     <DialogHeader>
//                         <div className="flex items-center gap-2">
//                             <DialogTitle>
//                                 <Image src={'/vercel.svg'} width={40} height={40} alt="Project Image" />
//                             </DialogTitle>
//                             <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={() => {
//                                 saveAnswer.mutate({
//                                     projectId: project!.id,
//                                     question,
//                                     answer: answers,
//                                     filesReferences
//                                 }, {
//                                     onSuccess: () => {
//                                         toast.success("Answer saved successfully")
//                                         refetch()
//                                     },
//                                     onError: () => {
//                                         toast.error("Error saving answer")
//                                     }
//                                 })
//                             }}>
//                                 Save Answer
//                             </Button>
//                         </div>
//                     </DialogHeader>
//                     <MDEditor.Markdown source={answers} className='max-w-[70vw] h-full max-h-[40vh] overflow-scroll' />
//                     <div className='h-4'></div>
//                     <CodeReferences filesReferences={filesReferences} />
//                     <Button type='button' onClick={() => { setOpen(false) }}>Close</Button>
//                     <p>Your question has been submitted!</p>
//                 </DialogContent>
//             </Dialog>
//             <Card className='relative w-full'>
//                 <CardHeader>
//                     <CardTitle>Ask a question</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={onSubmit}>
//                         <Textarea
//                             placeholder="Which file should I edit to change the home page?"
//                             className='resize-none'
//                             value={question}
//                             onChange={e => setQuestion(e.target.value)}
//                         />
//                         <div className='h-4'></div>
//                         <Button type='submit' disabled={loading}>
//                             Ask AI
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// export default AskQuestionCard;