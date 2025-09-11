
import React, { useState, useRef, useMemo } from 'react';
import { FolderIcon, FileIcon, UploadIcon, CodeFileIcon, AudioFileIcon } from '../components/icons';
import type { Folder, FileSystemNode } from '../types';
import { deepClone, getNodeFromPath } from '../system';

interface FileExplorerProps {
  fileSystem: Folder;
  openApp: (appId: string, options?: { filePath?: string; commandToRun?: string }) => void;
  setFileSystem: React.Dispatch<React.SetStateAction<Folder>>;
}

const CODE_FILE_EXTENSIONS = ['py', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'md', 'txt', 'c', 'cpp', 'h', 'hpp'];
const AUDIO_FILE_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a'];

interface SearchResult {
    name: string;
    path: string[];
    node: FileSystemNode;
}

const searchFileSystem = (node: Folder, currentPath: string[], query: string): SearchResult[] => {
    let results: SearchResult[] = [];
    const lowerCaseQuery = query.toLowerCase();

    for (const [name, childNode] of Object.entries(node.children)) {
        const newPath = [...currentPath, name];
        if (name.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ name, path: newPath, node: childNode });
        }

        if (childNode.type === 'folder') {
            results = results.concat(searchFileSystem(childNode, newPath, query));
        }
    }
    return results;
};


const FileExplorer: React.FC<FileExplorerProps> = ({ fileSystem, openApp, setFileSystem }) => {
  const [path, setPath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchFileSystem(fileSystem, [], searchQuery);
  }, [searchQuery, fileSystem]);

  const navigateTo = (folderName: string) => {
    setPath(prev => [...prev, folderName]);
  };

  const goBack = () => {
    setSearchQuery('');
    setPath(prev => prev.slice(0, -1));
  };

  const getCurrentNode = (): Folder => {
    let currentNode: Folder = fileSystem;
    for (const part of path) {
      const nextNode = currentNode.children[part];
      if (nextNode && nextNode.type === 'folder') {
        currentNode = nextNode;
      }
    }
    return currentNode;
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFileSystem(currentFs => {
                const newFs = deepClone(currentFs);
                const parentNode = getNodeFromPath(path, newFs);
                if (parentNode && parentNode.type === 'folder') {
                    let newName = file.name;
                    let counter = 1;
                    while (parentNode.children[newName]) {
                        const nameParts = file.name.split('.');
                        const extension = nameParts.pop();
                        newName = `${nameParts.join('.')}(${counter})${extension ? '.' + extension : ''}`;
                        counter++;
                    }
                    parentNode.children[newName] = { type: 'file', content };
                }
                return newFs;
            });
        };
        if (file.type.startsWith('text/') || file.type.includes('json') || file.type.includes('javascript')) {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const openFile = (filePath: string, fileName: string, fileNode: FileSystemNode) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (fileNode.type === 'file' && fileNode.content.startsWith('data:image')) {
      openApp('imageviewer', { filePath });
    } else if (AUDIO_FILE_EXTENSIONS.includes(extension)) {
      openApp('musicplayer', { filePath });
    } else if (['html', 'css', 'js', 'jsx', 'ts', 'tsx'].includes(extension)) {
      openApp('codecanvas', { filePath });
    } else if (extension === 'py') {
        openApp('terminal', { commandToRun: `python ${filePath}` });
    } else if (['c', 'cpp', 'h', 'hpp'].includes(extension)) {
      openApp('cplusplusstudio', { filePath });
    } else {
      openApp('editor', { filePath });
    }
  };

  const handleDoubleClick = (name: string, node: FileSystemNode) => {
    if (node.type === 'folder') {
      navigateTo(name);
    } else {
      const fullPath = [...path, name].join('/');
      openFile(fullPath, name, node);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.node.type === 'folder') {
        setPath(result.path);
        setSearchQuery('');
    } else {
        const fullPath = result.path.join('/');
        openFile(fullPath, result.name, result.node);
    }
  };

  const getFileIcon = (node: FileSystemNode, name: string) => {
    if (node.type === 'folder') return <FolderIcon />;
    
    const extension = name.split('.').pop()?.toLowerCase() || '';
    if (AUDIO_FILE_EXTENSIONS.includes(extension)) return <AudioFileIcon />;
    if (CODE_FILE_EXTENSIONS.includes(extension)) return <CodeFileIcon />;
    
    return <FileIcon />;
  }

  const currentFolder = getCurrentNode();
  const currentPath = ['C:', ...path].join('\\');

  return (
    <div className="h-full flex flex-col bg-gray-900/80 rounded-b-lg">
      <div className="flex-shrink-0 flex items-center gap-2 p-2 bg-gray-800/50 border-b border-white/10">
        <button
          onClick={goBack}
          disabled={path.length === 0}
          className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <button
          onClick={handleUploadClick}
          className="p-1 rounded hover:bg-gray-700 flex items-center gap-1 px-2"
          aria-label="Upload file"
        >
          <UploadIcon className="w-5 h-5" />
          <span>Upload</span>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />

        <div className="flex-grow bg-gray-900 px-2 py-1 rounded text-sm truncate">
          {currentPath}
        </div>
        <div className="relative flex-shrink-0">
            <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file system..."
                className="bg-gray-900 px-2 py-1 rounded text-sm w-48 pl-8"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {searchQuery.trim() ? (
            <div>
                <h2 className="text-lg font-semibold mb-2 text-white">Results for <span className="text-cyan-400">"{searchQuery}"</span></h2>
                {searchResults.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {searchResults.map((result, index) => {
                            const fullPath = ['C:', ...result.path].join('\\');
                            return (
                                <div
                                    key={`${index}-${result.name}`}
                                    onDoubleClick={() => handleSearchResultClick(result)}
                                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-cyan-500/20"
                                    title={fullPath}
                                >
                                    <div className="w-6 h-6 text-cyan-300 flex-shrink-0">
                                        {getFileIcon(result.node, result.name)}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm text-white truncate">{result.name}</span>
                                        <span className="text-xs text-gray-400 truncate">{fullPath}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400">No results found.</p>
                )}
            </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Object.entries(currentFolder.children).sort(([aName, aNode], [bName, bNode]) => {
                if (aNode.type !== bNode.type) {
                    return aNode.type === 'folder' ? -1 : 1;
                }
                return aName.localeCompare(bName);
            }).map(([name, node]) => (
                <div
                    key={name}
                    onDoubleClick={() => handleDoubleClick(name, node)}
                    className="flex flex-col items-center text-center p-2 rounded-lg cursor-pointer hover:bg-cyan-500/20"
                    title={name}
                >
                    <div className="w-12 h-12 text-cyan-300 mb-1">
                        {getFileIcon(node, name)}
                    </div>
                    <span className="text-xs text-white w-full truncate">{name}</span>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
