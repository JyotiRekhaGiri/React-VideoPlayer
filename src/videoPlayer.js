import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import "./videoPlayer.css";
import { FaSmile, FaTrash } from "react-icons/fa";

const VideoPlayer = () => {
    const [timestamp, setTimestamp] = useState(0);
    const [comments, setComments] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [hoveredCommentIndex, setHoveredCommentIndex] = useState(null);
    const [filteredComments, setFilteredComments] = useState([]);

    // Ref for the comment container to scroll to the bottom
    const commentContainerRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the comment container when comments change
        if (commentContainerRef.current) {
            commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
        }
    }, [comments]);

    const handleProgress = (state) => {
        setTimestamp(state.playedSeconds);
    };

    useEffect(() => {
        // Load comments from localStorage when the component mounts
        const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
        setComments(storedComments);
    }, []);

    const handleSendComment = () => {
        //update the comments state
        if (inputValue.trim() !== '') {
            const newComment = { timestamp, text: inputValue };
            const updatedComments = [...comments, newComment];
            setComments([...comments, newComment]);
            setInputValue(''); // Clear the input field after posting
            // Store the updated comments in localStorage
            localStorage.setItem('comments', JSON.stringify([...comments, newComment]));
        }
    };

    // Filter comments based on the stored timestamp when the video is played again
    // useEffect(() => {
    //     const storedTimestamp = localStorage.getItem('currentTimestamp');
    //     // Filter comments based on the stored timestamp when the video is played again
    //     const relevantComments = comments.filter(comment => comment.timestamp <= storedTimestamp);
    //     setFilteredComments(relevantComments);
    // }, [timestamp, comments]);  

    const handleDeleteComment = (index) => {
        const updatedComments = [...comments];
        updatedComments.splice(index, 1);
        setComments(updatedComments);
         // Update comments in localStorage
         localStorage.setItem('comments', JSON.stringify(updatedComments));
    };

    const handleEmojiClick = (emoji) => {
        setInputValue(inputValue + emoji);
        setShowEmojiPicker(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendComment();
        }
    };

    // Filter comments based on the stored timestamp when the video is played again
    const relevantComments = comments.filter(comment => comment.timestamp <= timestamp);
    const allComments = [...comments, ...relevantComments];

    //Array of emoji options
    const emojiOptions = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'];

    return (
        <div className='player'>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ReactPlayer
                    url="ads.mp4"
                    controls
                    playing  // autoplay
                    muted
                    width="98%"
                    height="auto"
                    onProgress={handleProgress}
                />
            </div>
            <div>
                <hr></hr>
                <h2 className='text-center'>Comments</h2>
                <hr></hr>
                <div className="comment-container" ref={commentContainerRef}>
                    <ul className="comments">
                        {comments.map((comment, index) => (
                            <li key={index} style={{ display: "flex", justifyContent: 'space-between' }}
                                onMouseEnter={() => setHoveredCommentIndex(index)}
                                onMouseLeave={() => setHoveredCommentIndex(null)}
                            >
                                <span>
                                    <strong>{comment.timestamp.toFixed(2)}s:</strong> {comment.text}
                                </span>
                                {hoveredCommentIndex === index && (
                                    <button onClick={() => handleDeleteComment(index)} style={{ right: '0' }}>
                                        <FaTrash />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='input-box'>
                    <input
                        type="text"
                        placeholder="Chat... "
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}><FaSmile /></button>
                    <button onClick={handleSendComment}>Send</button>
                    {showEmojiPicker && (
                        <div className='emoji-picker'>
                            {emojiOptions.map((emoji, index) => (
                                <span key={index} onClick={() => handleEmojiClick(emoji)}>{emoji}</span>
                            ))}
                        </div>
                    )}
                </div>
                <hr></hr>
                <h2 className='text-center' style={{ marginTop: "1rem" }}>Comments according to video play</h2>
                <hr></hr>
                <div className='comment-box'>
                    {relevantComments.map((comment, index) => (
                        <div key={index}>
                            <strong>{comment.timestamp.toFixed(2)}s:</strong> {comment.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
