const mediaModel = require("./media.model");
const Post = require("./post.model"); // Đảm bảo rằng bạn có model Post đã định nghĩa

// Lấy danh sách tất cả bài viết
exports.getPosts = async (req, res) => {
  try {
    // Tìm tất cả bài viết
    const posts = await Post.find().sort({
      createdAt: -1,
    });
    res.json(posts); // Trả về danh sách bài viết
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};

// Thêm bài viết mới
exports.addPost = async (req, res) => {
  const { image } = req.body;
  const imageFind = await mediaModel.findById(image);
  if (!imageFind) {
    throw new Error(`Không tìm thấy hình ảnh với ID ${item.image}`);
  }
  const post = new Post({
    title: req.body.title, // Lấy title từ body của request
    image: {
      _id: imageFind._id, // ID của hình ảnh
      filePath: imageFind.filePath, // Giả sử mediaModel có thuộc tính `filePath`
    },
    content: req.body.content, // Lấy content từ body của request
  });

  try {
    const newPost = await post.save(); // Lưu bài viết mới vào database
    res.status(201).json(newPost); // Trả về bài viết vừa tạo
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật bài viết theo ID
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Tìm bài viết theo ID
    if (!post)
      return res.status(404).json({ message: "Bài viết không tồn tại." }); // Nếu không tìm thấy bài viết
    const { image } = req.body;
    const imageFind = await mediaModel.findById(image);
    if (!imageFind) {
      throw new Error(`Không tìm thấy hình ảnh với ID ${item.image}`);
    }
    // Cập nhật thông tin bài viết
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.image =
      {
        _id: imageFind._id,
        filePath: imageFind.filePath,
      } || post.image;

    const updatedPost = await post.save(); // Lưu bài viết đã cập nhật
    res.json(updatedPost); // Trả về bài viết đã cập nhật
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(400).json({ message: error.message });
  }
};

// Lấy bài viết theo ID
exports.getPostById = async (req, res) => {
  try {
    // Tìm bài viết theo ID trong params
    const post = await Post.findById(req.params.id);

    // Nếu không tìm thấy bài viết
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại!" });
    }

    // Trả về bài viết nếu tìm thấy
    res.json(post);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};

// Xóa bài viết theo ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id); // Tìm bài viết theo ID
    if (!post)
      return res.status(404).json({ message: "Bài viết không tồn tại." }); // Nếu không tìm thấy bài viết
    res.json({ message: "Bài viết đã được xóa." }); // Trả về thông báo xóa thành công
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};
