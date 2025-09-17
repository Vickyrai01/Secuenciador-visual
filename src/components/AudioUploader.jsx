export default function AudioUploader({ onFileChange }) {
  return (
    <div>
      <h2>Subi la cancion que queres descomponer</h2>
      <input 
        type = "file" 
        accept = "audio/*"
        onChange = {(e) => onFileChange(e.target.files[0])}
      />
    </div>
  )
}