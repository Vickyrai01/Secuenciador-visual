export function handleFileChange(e, setLocalFile) {
  setLocalFile(e.target.files[0] || null);
}

export function handleBpmChange(e, setLocalBpm) {
  setLocalBpm(e.target.value);
}

export function handleSubmit(e, onSubmit, localFile, localBpm) {
  e.preventDefault();
  onSubmit(localFile, localBpm);
}