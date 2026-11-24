"use client"

import { Composer } from "./forum-social-composer"
import { FeedTabs, LeftRail, RightRail, StoryStrip, TopBar } from "./forum-social-layout"
import { PostCard, PostModal } from "./forum-social-post"
import { useForumSocialController } from "./use-forum-social-controller"

export function ForumSocialAppShell() {
    const controller = useForumSocialController()
    const {
        posts,
        composerText,
        commentDrafts,
        replyingTo,
        activePost,
        setComposerText,
        setCommentDrafts,
        setReplyingTo,
        setActivePostId,
        reactToPost,
        reactToComment,
        createPost,
        addComment,
        sharePost,
        toggleSaved,
    } = controller

    return (
<div className="min-h-screen bg-[#eef0f4] text-[#050505] [font-family:'Be_Vietnam_Pro','Noto_Sans',system-ui,sans-serif]">
    <TopBar />

    <div className="relative mx-auto max-w-[1920px] pt-14">
        <LeftRail />

        <main className="min-h-screen w-full max-w-[720px] space-y-3 px-2 pb-10 pt-4 sm:px-0 lg:ml-[360px] lg:max-w-[680px] xl:max-w-[720px] 2xl:mx-auto 2xl:ml-auto">
            <StoryStrip />
            <Composer value={composerText} onChange={setComposerText} onSubmit={createPost} />
            <FeedTabs />
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onOpen={() => setActivePostId(post.id)}
                    onReact={(reaction) => reactToPost(post.id, reaction)}
                    onShare={() => sharePost(post.id)}
                    onToggleSaved={() => toggleSaved(post.id)}
                    commentDrafts={commentDrafts}
                    setCommentDrafts={setCommentDrafts}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    onAddComment={addComment}
                    onReactComment={reactToComment}
                />
            ))}
        </main>

        <RightRail />
    </div>

    {activePost && (
        <PostModal
            post={activePost}
            onClose={() => setActivePostId(null)}
            onReact={(reaction) => reactToPost(activePost.id, reaction)}
            onShare={() => sharePost(activePost.id)}
            onToggleSaved={() => toggleSaved(activePost.id)}
            commentDrafts={commentDrafts}
            setCommentDrafts={setCommentDrafts}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            onAddComment={addComment}
            onReactComment={reactToComment}
        />
    )}
</div>
    )
}
