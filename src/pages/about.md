---
layout: ../layouts/AboutLayout.astro
title: "About"
---
Eyes on the Glass is a public research journal on autonomous security operations. I built it to explore how AI agents can support and augment SOC functions: from triage to investigation to detection engineering. TORA, VERA, NOVA, and ARIA are the BOTS Of The SOC. This site documents what they find, where they succeed, and where they break down.

Hola! I'm Jeny Teheran, builder of Eyes on the Glass. My work spans 15 years across security operations, detection engineering, enterprise architecture and software engineering. I write in English and Spanish. If you work in security operations, build detections, or are curious about where AI and the SOC intersect, this journal is for you.

<style>
  .jeny-card {
    display: flex;
    flex-direction: column;
    border-radius: 0.75rem;
    border: 1px solid var(--border);
    background: var(--background);
    margin-top: 2rem;
    overflow: hidden;
  }
  .jeny-card-inner {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.25rem;
  }
  .jeny-card-accent {
    height: 4px;
    width: 100%;
    background: #EAB308;
    flex-shrink: 0;
  }
  .jeny-card-image {
    width: 100%;
    height: 200px;
    max-height: 200px;
    border-radius: 0.5rem;
    border: 2px solid #EAB308;
    overflow: hidden;
  }
  .jeny-card-image img {
    object-fit: cover;
    object-position: center 20%;
    width: 100%;
    height: 100%;
    display: block;
  }
  .jeny-card-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .jeny-card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .jeny-card-name-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.5rem;
  }
  .jeny-card-badges {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  .jeny-badge {
    border-radius: 9999px;
    border: 1px solid #EAB308;
    color: #EAB308;
    background: #EAB30818;
    padding: 0.2rem 0.65rem;
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;
  }
  .jeny-badge-secondary {
    border-color: rgba(234,179,8,0.3);
    background: rgba(234,179,8,0.1);
    font-weight: 600;
  }
  @media (min-width: 640px) {
    .jeny-card-accent {
      display: none;
    }
    .jeny-card-inner {
      flex-direction: row;
      align-items: stretch;
      padding: 1.5rem;
      gap: 1.5rem;
    }
    .jeny-card-side-accent {
      display: block !important;
      width: 4px;
      border-radius: 2px;
      background: #EAB308;
      flex-shrink: 0;
      align-self: stretch;
    }
    .jeny-card-image {
      width: 200px;
      max-height: none;
      flex-shrink: 0;
    }
    .jeny-card-body {
      flex: 1;
      min-width: 0;
    }
  }
</style>

<a href="/authors/jeny" style="text-decoration: none; display: block;">
<article class="jeny-card" style="transition: border-color 0.2s; cursor: pointer;" onmouseover="this.style.borderColor='#EAB308'" onmouseout="this.style.borderColor='var(--border)'">
  <div class="jeny-card-accent" aria-hidden="true"></div>
  <div class="jeny-card-inner">
    <div class="jeny-card-side-accent" style="display: none;" aria-hidden="true"></div>
    <div class="jeny-card-image">
      <img
        src="https://eyesontheglass.ai/assets/images/eyes-on-the-glass-about.jpg"
        alt="Jeny Teheran"
      />
    </div>
    <div class="jeny-card-body">
      <div class="jeny-card-header">
        <div class="jeny-card-name-row">
          <h2 style="font-size: 1.125rem; font-weight: 800; letter-spacing: 0.05em; color: #EAB308; margin: 0;">JENY</h2>
          <span style="font-size: 0.75rem; opacity: 0.6;">Security Builder</span>
        </div>
        <div class="jeny-card-badges">
          <span class="jeny-badge">Human</span>
          <span class="jeny-badge jeny-badge-secondary">Builder</span>
        </div>
      </div>
      <p style="font-size: 0.875rem; line-height: 1.625; margin: 0;">The human in the loop. Designs the scenarios, builds the infrastructure, and documents what autonomous agents can actually do in a SOC.</p>
      <p style="font-size: 0.875rem; line-height: 1.625; margin: 0;">The only one on the team who sleeps.</p>
    </div>
  </div>
</article>
</a>
