"use client" 

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
// const FileUpload = () => {
//     // State to keep track of the current upload progress (percentage)
//     const [progress, setProgress] = useState(0);

//     // Create a ref for the file input element to access its files easily
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     // Create an AbortController instance to provide an option to cancel the upload if needed.
//     const abortController = new AbortController();

    
//     const authenticator = async () => {
//         try {
//             // Perform the request to the upload authentication endpoint.
//             const response = await fetch("/api/imagekit-auth");
//             if (!response.ok) {
//                 // If the server response is not successful, extract the error text for debugging.
//                 const errorText = await response.text();
//                 throw new Error(`Request failed with status ${response.status}: ${errorText}`);
//             }

//             // Parse and destructure the response JSON for upload credentials.
//             const data = await response.json();
//             const { signature, expire, token, publicKey } = data;
//             return { signature, expire, token, publicKey };
//         } catch (error) {
//             // Log the original error for debugging before rethrowing a new error.
//             console.error("Authentication error:", error);
//             throw new Error("Authentication request failed");
//         }
//     };

//     /**
//      * Handles the file upload process.
//      *
//      * This function:
//      * - Validates file selection.
//      * - Retrieves upload authentication credentials.
//      * - Initiates the file upload via the ImageKit SDK.
//      * - Updates the upload progress.
//      * - Catches and processes errors accordingly.
//      */
//     const handleUpload = async () => {
//         // Access the file input element using the ref
//         const fileInput = fileInputRef.current;
//         if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
//             alert("Please select a file to upload");
//             return;
//         }

//         // Extract the first file from the file input
//         const file = fileInput.files[0];

//         // Retrieve authentication parameters for the upload.
//         let authParams;
//         try {
//             authParams = await authenticator();
//         } catch (authError) {
//             console.error("Failed to authenticate for upload:", authError);
//             return;
//         }
//         const { signature, expire, token, publicKey } = authParams;

//         // Call the ImageKit SDK upload function with the required parameters and callbacks.
//         try {
//             const uploadResponse = await upload({
//                 // Authentication parameters
//                 expire,
//                 token,
//                 signature,
//                 publicKey,
//                 file,
//                 fileName: file.name, // Optionally set a custom file name
//                 // Progress callback to update upload progress state
//                 onProgress: (event) => {
//                     setProgress((event.loaded / event.total) * 100);
//                 },
//                 // Abort signal to allow cancellation of the upload if needed.
//                 abortSignal: abortController.signal,
//             });
//             console.log("Upload response:", uploadResponse);
//         } catch (error) {
//             // Handle specific error types provided by the ImageKit SDK.
//             if (error instanceof ImageKitAbortError) {
//                 console.error("Upload aborted:", error.reason);
//             } else if (error instanceof ImageKitInvalidRequestError) {
//                 console.error("Invalid request:", error.message);
//             } else if (error instanceof ImageKitUploadNetworkError) {
//                 console.error("Network error:", error.message);
//             } else if (error instanceof ImageKitServerError) {
//                 console.error("Server error:", error.message);
//             } else {
//                 // Handle any other errors that may occur.
//                 console.error("Upload error:", error);
//             }
//         }
//     };

//     return (
//         <>
           
//             <input type="file" ref={fileInputRef} />
            
//             <button type="button" onClick={handleUpload}>
//                 Upload file
//             </button>
//             <br />
            
//             Upload progress: <progress value={progress} max={100}></progress>
//         </>
//     );
// };


// export default FileUpload;



// another way to write imagekit code 


interface fileUploadProps{
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "image" | "video"
}

const fileUploadSecondMeth = ({onSuccess , onProgress , fileType} : fileUploadProps) => {
    
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    //optional validation
    
    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file")
            }
        }
        if(file.size > 100 * 1024 * 1024){
            setError("File size should be under 100MB")
        }
        return true
    }

const handleFileChange = async ( e: React.ChangeEvent<HTMLInputElement> ) => {

    const file = e.target.files?.[0]

    if(!file || !validateFile(file)) return

    setUploading(true)
    setError(null)

    try {
        const authResponse = await fetch("/api/auth/imagekit-auth")

        const auth = await authResponse.json()
        
        const res = await upload({
            file,
            fileName: file.name,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            signature: auth.signature,
            expire: auth.expire,
            token: auth.token,

            onProgress: (event) => {
                if (event.lengthComputable && onProgress) {
                    const percent = (event.loaded / event.total) * 100;

                    onProgress(Math.round(percent))
                }
            }
        })

        onSuccess(res)
        
    } catch (error) {
        console.error("Upload failed", error)
    } finally{
        setUploading(false)
    }
}

    return (
        <>
           
            <input
            type="file"
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}
            />
            {uploading && (
                <span>Loading...</span>
            )}
         
        </>
    );

}




export default fileUploadSecondMeth
