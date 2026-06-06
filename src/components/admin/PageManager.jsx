import { useState } from 'react';
import { buildNewPage, getSortedPageEntries, renamePagePath } from '../../utils/pages';
import { Field } from './BlockEditor';
import './PageManager.css';

export default function PageManager({ pages, onChange, activePage, onSelectPage }) {
  const [newTitle, setNewTitle] = useState('');
  const [localError, setLocalError] = useState('');

  const sortedPages = getSortedPageEntries(pages);

  const updatePageMeta = (path, field, value) => {
    onChange({
      ...pages,
      [path]: { ...pages[path], [field]: value },
    });
  };

  const handleAddPage = () => {
    setLocalError('');
    const title = newTitle.trim();
    if (!title) {
      setLocalError('Enter a page title.');
      return;
    }

    const { path, page } = buildNewPage(title, pages);
    onChange({ ...pages, [path]: page });
    setNewTitle('');
    onSelectPage(path);
  };

  const handleDeletePage = (path) => {
    if (!window.confirm(`Delete "${pages[path].title}"? This cannot be undone.`)) return;

    const next = { ...pages };
    delete next[path];
    onChange(next);
    if (activePage === path) onSelectPage('home');
  };

  const handleSlugChange = (path, slugValue) => {
    const result = renamePagePath(pages, path, slugValue);
    if (result.error) {
      setLocalError(result.error);
      return;
    }
    setLocalError('');
    onChange(result.pages);
    if (activePage === path && result.newPath !== path) {
      onSelectPage(result.newPath);
    }
  };

  return (
    <div className="page-manager">
      {localError && <div className="admin-error">{localError}</div>}

      <div className="page-manager-add">
        <Field label="New Page Title">
          <div className="page-manager-add-row">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Services"
            />
            <button type="button" className="btn btn-teal btn-sm" onClick={handleAddPage}>
              Add Page
            </button>
          </div>
        </Field>
      </div>

      <div className="page-manager-list">
        {sortedPages.map(([path, page]) => (
          <div key={path} className={`page-manager-row${activePage === path ? ' active' : ''}`}>
            <div className="page-manager-row-main">
              <button type="button" className="page-manager-select" onClick={() => onSelectPage(path)}>
                <strong>{page.title}</strong>
                <span>{path}</span>
              </button>

              <label className="page-manager-nav-toggle">
                <input
                  type="checkbox"
                  checked={page.showInNav !== false}
                  onChange={(e) => updatePageMeta(path, 'showInNav', e.target.checked)}
                />
                Show in nav
              </label>

              <button type="button" className="page-manager-delete" onClick={() => handleDeletePage(path)}>
                Delete
              </button>
            </div>

            <div className="page-manager-row-fields">
              <Field label="Nav Label">
                <input
                  type="text"
                  value={page.navLabel || page.title}
                  onChange={(e) => updatePageMeta(path, 'navLabel', e.target.value)}
                />
              </Field>
              <Field label="URL Slug" hint={`Page URL: ${path}`}>
                <input
                  type="text"
                  defaultValue={path.replace(/^\//, '')}
                  key={path}
                  onBlur={(e) => handleSlugChange(path, e.target.value)}
                />
              </Field>
              <Field label="Nav Order">
                <input
                  type="number"
                  min={0}
                  value={page.navOrder ?? 0}
                  onChange={(e) => updatePageMeta(path, 'navOrder', Number(e.target.value))}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
