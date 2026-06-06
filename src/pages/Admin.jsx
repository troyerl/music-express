import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../auth/AuthContext';
import { getPageBuilderOptions } from '../utils/pages';
import { blocksToDraft, blocksFromDraft } from '../data/contentBlocks';
import { PAGE_TEMPLATES } from '../data/pageTemplates';
import BlockEditor, { Field } from '../components/admin/BlockEditor';
import MediaLibrary from '../components/admin/MediaLibrary';
import PageManager from '../components/admin/PageManager';
import './Admin.css';

function prepareDraft(content) {
  const draft = {
    ...structuredClone(content),
    galleryImagesText: content.galleryImages.join('\n'),
    hero: {
      ...structuredClone(content.hero),
      headlinesText: content.hero.headlines.join('\n'),
    },
    homeBlocks: blocksToDraft(content.homeBlocks || []),
  };

  draft.pages = Object.fromEntries(
    Object.entries(content.pages).map(([path, page]) => [
      path,
      {
        ...structuredClone(page),
        blocks: blocksToDraft(page.blocks || []),
      },
    ]),
  );

  return draft;
}

function Section({ title, children }) {
  return (
    <section className="admin-section">
      <h2>{title}</h2>
      <div className="admin-section-body">{children}</div>
    </section>
  );
}

export default function Admin() {
  const { content, loading: contentLoading, replaceContent, resetContent, saved } = useContent();
  const { logout, user } = useAuth();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    if (!contentLoading) {
      setDraft(prepareDraft(content));
    }
  }, [content, contentLoading]);

  if (contentLoading || !draft) {
    return (
      <div className="auth-loading">
        <p>Loading admin...</p>
      </div>
    );
  }

  const pageBuilderOptions = getPageBuilderOptions(draft.pages);

  const set = (path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateCard = (index, field, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.featureCards[index][field] = value;
      return next;
    });
  };

  const updatePage = (path, field, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.pages[path][field] = value;
      return next;
    });
  };

  const updatePageBlocks = (path, blocks) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      if (path === 'home') {
        next.homeBlocks = blocks;
      } else {
        next.pages[path].blocks = blocks;
      }
      return next;
    });
  };

  const updatePages = (pages) => {
    setDraft((prev) => ({ ...prev, pages }));
  };

  const updateUploadedMedia = (uploadedMedia) => {
    setDraft((prev) => ({ ...prev, uploadedMedia }));
  };

  const addUploadedMedia = (items) => {
    setDraft((prev) => ({
      ...prev,
      uploadedMedia: [...(prev.uploadedMedia || []), ...items],
    }));
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  const finalizeDraft = (draftState) => {
    const galleryImages = draftState.galleryImagesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const headlines = draftState.hero.headlinesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const next = structuredClone(draftState);
    next.galleryImages = galleryImages;
    next.hero.headlines = headlines;
    next.homeBlocks = blocksFromDraft(next.homeBlocks || []);
    next.pages = Object.fromEntries(
      Object.entries(next.pages).map(([path, page]) => [
        path,
        {
          ...page,
          blocks: blocksFromDraft(page.blocks || []),
        },
      ]),
    );

    delete next.galleryImagesText;
    delete next.hero.headlinesText;

    return { next, galleryImages, headlines };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const { next, galleryImages, headlines } = finalizeDraft(draft);

    if (galleryImages.length === 0) {
      setError('Gallery needs at least one image.');
      return;
    }

    if (headlines.length === 0) {
      setError('Hero needs at least one headline.');
      return;
    }

    setSaving(true);

    try {
      await replaceContent(next);
      setDraft(prepareDraft(next));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'We could not update the website. Please sign in and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all content to defaults and publish? This cannot be undone.')) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      await resetContent();
      window.location.reload();
    } catch (err) {
      setError(err.message || 'We could not reset the website. Please try again.');
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraft(prepareDraft(content));
    setError('');
  };

  const loadPageTemplate = () => {
    const template = PAGE_TEMPLATES[activePage];
    if (!template) return;

    if (!window.confirm(`Replace ${activePage === 'home' ? 'home page' : 'this page'} blocks with the original site template?`)) {
      return;
    }

    if (activePage === 'home') return;

    setDraft((prev) => {
      const next = structuredClone(prev);
      next.pages[activePage] = {
        ...next.pages[activePage],
        title: template.title,
        body: template.body ?? '',
        blocks: blocksToDraft(structuredClone(template.blocks)),
      };
      return next;
    });
  };

  const activeBlocks =
    activePage === 'home' ? draft.homeBlocks : draft.pages[activePage]?.blocks || [];

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <h1>Website Editor</h1>
            <p>
              Change text and photos below, then click <strong>Update Website</strong>. Your customers
              will see the changes right away — no extra steps needed.
            </p>
          </div>
          <div className="admin-header-actions">
            {user && <span className="admin-user">{user.signInDetails?.loginId || user.username}</span>}
            <Link to="/" className="btn btn-gray" target="_blank" rel="noopener noreferrer">
              View Website
            </Link>
            <button type="button" className="btn btn-gray" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <form className="admin-form" onSubmit={handleSave}>
        {error && <div className="admin-error">{error}</div>}
        {saved && (
          <div className="admin-success">
            Your website has been updated. Visitors can see your changes now.{' '}
            <Link to="/" target="_blank" rel="noopener noreferrer">
              View website
            </Link>
          </div>
        )}

        <Section title="Contact Info">
          <Field label="Phone Number">
            <input
              type="text"
              value={draft.phone}
              onChange={(e) => set('phone', e.target.value)}
              required
            />
          </Field>
          <Field label="Copyright Text">
            <input
              type="text"
              value={draft.copyright}
              onChange={(e) => set('copyright', e.target.value)}
              required
            />
          </Field>
          <div className="admin-row">
            <Field label="Facebook URL">
              <input
                type="url"
                value={draft.social.facebook}
                onChange={(e) => set('social.facebook', e.target.value)}
              />
            </Field>
            <Field label="Twitter URL">
              <input
                type="url"
                value={draft.social.twitter}
                onChange={(e) => set('social.twitter', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Your Photos">
          <p className="admin-section-intro">
            Upload photos here, then add them to a page or carousel below.
          </p>
          <MediaLibrary media={draft.uploadedMedia || []} onChange={updateUploadedMedia} />
        </Section>

        <Section title="Page Content">
          <p className="admin-section-intro">
            Pick a page, then add or edit text, headings, photos, and slideshows.
          </p>

          <div className="page-selector">
            {pageBuilderOptions.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={activePage === key ? 'active' : ''}
                onClick={() => setActivePage(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {activePage !== 'home' && (
            <Field label="Page Title">
              <input
                type="text"
                value={draft.pages[activePage].title}
                onChange={(e) => updatePage(activePage, 'title', e.target.value)}
              />
            </Field>
          )}

          {PAGE_TEMPLATES[activePage] && (
            <div className="admin-template-bar">
              <p>
                A pre-built template matching{' '}
                <a href={`http://www.musicexpress.org${activePage}.html`} target="_blank" rel="noopener noreferrer">
                  the original {draft.pages[activePage]?.title} page
                </a>{' '}
                is available.
              </p>
              <button type="button" className="btn btn-orange btn-sm" onClick={loadPageTemplate}>
                Load Original Template
              </button>
            </div>
          )}

          <BlockEditor
            label={activePage === 'home' ? 'Home Page Blocks' : `${draft.pages[activePage]?.title} Blocks`}
            blocks={activeBlocks}
            onChange={(blocks) => updatePageBlocks(activePage, blocks)}
            uploadedMedia={draft.uploadedMedia || []}
            onAddMedia={addUploadedMedia}
          />
        </Section>

        <details className="admin-advanced">
          <summary>Advanced settings</summary>
          <div className="admin-advanced-body">
            <Section title="Pages &amp; Navigation">
              <p className="admin-section-intro">
                Add or remove pages and control what appears in the site menu.
              </p>
              <PageManager
                pages={draft.pages}
                onChange={updatePages}
                activePage={activePage}
                onSelectPage={setActivePage}
              />
            </Section>

            <Section title="Logo &amp; Header Images">
              {Object.entries(draft.images).map(([key, value]) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()}>
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => set(`images.${key}`, e.target.value)}
                  />
                </Field>
              ))}
            </Section>

            <Section title="Homepage Slideshow">
              <div className="admin-row">
                <Field label="CTA Line 1">
                  <input
                    type="text"
                    value={draft.hero.ctaLine1}
                    onChange={(e) => set('hero.ctaLine1', e.target.value)}
                  />
                </Field>
                <Field label="CTA Line 2">
                  <input
                    type="text"
                    value={draft.hero.ctaLine2}
                    onChange={(e) => set('hero.ctaLine2', e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Headlines" hint="One headline per line">
                <textarea
                  rows={4}
                  value={draft.hero.headlinesText}
                  onChange={(e) => set('hero.headlinesText', e.target.value)}
                />
              </Field>
              <Field label="Slideshow Photos" hint="One web address per line, or use Your Photos above">
                <textarea
                  rows={6}
                  value={draft.galleryImagesText}
                  onChange={(e) => set('galleryImagesText', e.target.value)}
                />
              </Field>
            </Section>

            <Section title="Feature Cards">
              {draft.featureCards.map((card, index) => (
                <div key={index} className="admin-card-editor">
                  <h3>Card {index + 1}</h3>
                  <Field label="Title">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(index, 'title', e.target.value)}
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={card.description}
                      onChange={(e) => updateCard(index, 'description', e.target.value)}
                    />
                  </Field>
                  <Field label="Media Type">
                    <select
                      value={card.mediaType}
                      onChange={(e) => updateCard(index, 'mediaType', e.target.value)}
                    >
                      <option value="youtube">YouTube Video</option>
                      <option value="image">Image</option>
                    </select>
                  </Field>
                  {card.mediaType === 'youtube' ? (
                    <Field label="YouTube Video ID" hint="e.g. 6388dAsgc5w">
                      <input
                        type="text"
                        value={card.youtubeId}
                        onChange={(e) => updateCard(index, 'youtubeId', e.target.value)}
                      />
                    </Field>
                  ) : (
                    <>
                      <Field label="Image URL">
                        <input
                          type="url"
                          value={card.imageUrl}
                          onChange={(e) => updateCard(index, 'imageUrl', e.target.value)}
                        />
                      </Field>
                      <Field label="Image Alt Text">
                        <input
                          type="text"
                          value={card.imageAlt}
                          onChange={(e) => updateCard(index, 'imageAlt', e.target.value)}
                        />
                      </Field>
                    </>
                  )}
                  <div className="admin-row">
                    <Field label="Button Label">
                      <input
                        type="text"
                        value={card.buttonLabel}
                        onChange={(e) => updateCard(index, 'buttonLabel', e.target.value)}
                      />
                    </Field>
                    <Field label="Button Link">
                      <input
                        type="text"
                        value={card.buttonHref}
                        onChange={(e) => updateCard(index, 'buttonHref', e.target.value)}
                      />
                    </Field>
                  </div>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={card.buttonExternal}
                      onChange={(e) => updateCard(index, 'buttonExternal', e.target.checked)}
                    />
                    Open button link in new tab (external)
                  </label>
                  <div className="admin-row">
                    <Field label="Extra Button Label (optional)">
                      <input
                        type="text"
                        value={card.extraButtonLabel}
                        onChange={(e) => updateCard(index, 'extraButtonLabel', e.target.value)}
                      />
                    </Field>
                    <Field label="Extra Button Link">
                      <input
                        type="text"
                        value={card.extraButtonHref}
                        onChange={(e) => updateCard(index, 'extraButtonHref', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </Section>

            <Section title="Service Areas">
              <Field label="Cities List">
                <textarea
                  rows={3}
                  value={draft.serviceAreas}
                  onChange={(e) => set('serviceAreas', e.target.value)}
                />
              </Field>
            </Section>

            <Section title="Region Banner">
              <Field label="Title">
                <input
                  type="text"
                  value={draft.regionBanner.title}
                  onChange={(e) => set('regionBanner.title', e.target.value)}
                />
              </Field>
              <Field label="Subtitle">
                <input
                  type="text"
                  value={draft.regionBanner.subtitle}
                  onChange={(e) => set('regionBanner.subtitle', e.target.value)}
                />
              </Field>
              <Field label="Button Label">
                <input
                  type="text"
                  value={draft.regionBanner.ctaLabel}
                  onChange={(e) => set('regionBanner.ctaLabel', e.target.value)}
                />
              </Field>
            </Section>

            <div className="admin-actions admin-actions-inline">
              <button type="button" className="btn btn-gray" onClick={handleDiscard} disabled={saving}>
                Cancel My Edits
              </button>
              <button type="button" className="btn btn-orange" onClick={handleReset} disabled={saving}>
                Restore Original Website
              </button>
            </div>
          </div>
        </details>

        <div className="admin-save-bar">
          <p>Finished editing? Update the live website for all visitors.</p>
          <button type="submit" className="btn btn-teal" disabled={saving}>
            {saving ? 'Updating website...' : 'Update Website'}
          </button>
        </div>
      </form>
    </div>
  );
}
