
import React, { useState, useRef } from 'react';
import { FolderIcon, FileIcon, UploadIcon, CodeFileIcon } from '../components/icons';
import type { Folder, FileSystemNode } from '../types';
import { deepClone, getNodeFromPath } from '../system';

interface FileExplorerProps {
  fileSystem: Folder;
  openApp: (appId: string, options?: { filePath?: string; commandToRun?: string }) => void;
  setFileSystem: React.Dispatch<React.SetStateAction<Folder>>;
}

const CODE_FILE_EXTENSIONS = ['py', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'md', 'txt'];

const FileExplorer: React.FC<FileExplorerProps> = ({ fileSystem, openApp, setFileSystem }) => {
  const [path, setPath] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigateTo = (folderName: string) => {
    setPath(prev => [...prev, folderName]);
  };

  const goBack = () => {
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
                    // Avoid overwriting existing files with the same name during upload
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
        // Use readAsDataURL for non-text files to store them as base64
        if (file.type.startsWith('text/') || file.type.includes('json') || file.type.includes('javascript')) {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDoubleClick = (name: string, node: FileSystemNode) => {
    if (node.type === 'folder') {
      navigateTo(name);
    } else {
      const fullPath = [...path, name].join('/');
      const extension = name.split('.').pop()?.toLowerCase();
      
      if (extension === 'html') {
        openApp('browser', { filePath: fullPath });
      } else if (extension === 'py') {
        openApp('terminal', { commandToRun: `python /${fullPath}` });
      } else if (extension === 'js') {
        openApp('terminal', { commandToRun: `node /${fullPath}` });
      } else if (node.content.startsWith('data:image')) {
        alert(`Opening images is not supported yet, but "${name}" has been stored.`);
      } else {
        // Default action for all other files is to open in the text editor
        openApp('editor', { filePath: fullPath });
      }
    }
  };

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
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Object.entries(currentFolder.children).sort(([aName, aNode], [bName, bNode]) => {
              if (aNode.type !== bNode.type) {
                  return aNode.type === 'folder' ? -1 : 1;
              }
              return aName.localeCompare(bName);
          }).map(([name, node]) => {
            const extension = name.split('.').pop()?.toLowerCase();
            const isCodeFile = !!extension && CODE_FILE_EXTENSIONS.includes(extension);
            return (
                <div
                key={name}
                onDoubleClick={() => handleDoubleClick(name, node)}
                className="flex flex-col items-center text-center p-2 rounded-lg cursor-pointer hover:bg-cyan-500/20"
                title={name}
                >
                <div className="w-12 h-12 text-cyan-300 mb-1">
                    {node.type === 'folder' ? <FolderIcon /> : (isCodeFile ? <CodeFileIcon /> : <FileIcon />)}
                </div>
                <span className="text-xs text-white w-full truncate">{name}</span>
                </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;