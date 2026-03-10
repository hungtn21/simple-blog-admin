import { render, screen } from '@testing-library/react';
import Postcard from './Postcard';

describe('Postcard Component', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post Title',
    content: 'This is test post content',
    image: 'https://picsum.photos/200',
  };

  it('renders post title correctly', () => {
    render(<Postcard post={mockPost} />);
    
    const titleElement = screen.getByText('Test Post Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('text-2xl', 'font-bold');
  });

  it('renders post content correctly', () => {
    render(<Postcard post={mockPost} />);
    
    const contentElement = screen.getByText('This is test post content');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement).toHaveClass('text-gray-700');
  });

  it('renders post image with correct props', () => {
    render(<Postcard post={mockPost} />);
    
    const imageElement = screen.getByAltText('Test Post Title');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', expect.stringContaining('picsum.photos'));
  });

  it('renders all post elements together', () => {
    render(<Postcard post={mockPost} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is test post content')).toBeInTheDocument();
    expect(screen.getByAltText('Test Post Title')).toBeInTheDocument();
  });

  it('handles different post data', () => {
    const differentPost = {
      id: 2,
      title: 'Another Post',
      content: 'Different content here',
      image: 'https://example.com/image.png',
    };

    render(<Postcard post={differentPost} />);
    
    expect(screen.getByText('Another Post')).toBeInTheDocument();
    expect(screen.getByText('Different content here')).toBeInTheDocument();
    expect(screen.getByAltText('Another Post')).toBeInTheDocument();
  });

  it('renders with container div', () => {
    const { container } = render(<Postcard post={mockPost} />);
    
    const divElement = container.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });

  it('does not render image when post.image is null', () => {
    const postWithoutImage = {
      id: 3,
      title: 'Post Without Image',
      content: 'This post has no image',
      image: null,
    };

    render(<Postcard post={postWithoutImage} />);
    
    expect(screen.getByText('Post Without Image')).toBeInTheDocument();
    expect(screen.getByText('This post has no image')).toBeInTheDocument();
    expect(screen.queryByAltText('Post Without Image')).not.toBeInTheDocument();
  });

  it('does not render image when post.image is undefined', () => {
    const postWithoutImage = {
      id: 4,
      title: 'Post Without Image URL',
      content: 'Image is undefined',
    };

    render(<Postcard post={postWithoutImage} />);
    
    expect(screen.getByText('Post Without Image URL')).toBeInTheDocument();
    expect(screen.queryByAltText('Post Without Image URL')).not.toBeInTheDocument();
  });

  it('does not render image when post.image is empty string', () => {
    const postWithEmptyImage = {
      id: 5,
      title: 'Post With Empty Image',
      content: 'Image is empty string',
      image: '',
    };

    render(<Postcard post={postWithEmptyImage} />);
    
    expect(screen.getByText('Post With Empty Image')).toBeInTheDocument();
    expect(screen.queryByAltText('Post With Empty Image')).not.toBeInTheDocument();
  });

  it('does not render image when post.image is invalid URL', () => {
    const postWithInvalidImage = {
      id: 6,
      title: 'Post With Invalid URL',
      content: 'Image URL is just "a"',
      image: 'a',
    };

    render(<Postcard post={postWithInvalidImage} />);
    
    expect(screen.getByText('Post With Invalid URL')).toBeInTheDocument();
    expect(screen.queryByAltText('Post With Invalid URL')).not.toBeInTheDocument();
  });
});
