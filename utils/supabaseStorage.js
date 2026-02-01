const supabase = require("../config/supbase");

const uploadFile = async (bucket, file) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;
  return data.path;
};

const deleteFile = async (bucket, url) => {
  if (!url) return;
  const path = url.split("/general/")[1];
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error.message;
};

module.exports = { uploadFile, deleteFile };
