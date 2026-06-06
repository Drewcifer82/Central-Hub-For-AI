/* ─── prompt-library-data.js — Prompt Library categories & prompts ── */

const PROMPT_LIBRARY = [

  /* ── 1. Software Development ─────────────────────────────────── */
  {
    id: 'software-dev',
    category: 'Software Development',
    icon: `<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>`,
    color: 'purple',
    tools: [
      {
        name: 'Claude Code',
        prompts: [
          {
            title: 'Project Kickstart',
            text: `I'm starting a new [project type] using [tech stack]. Before writing any code, ask me 3 clarifying questions about requirements. Then suggest a folder structure and draft a CLAUDE.md file that captures our coding conventions, your role, and how we'll handle testing and commits. Flag any concerns before we begin.`,
          },
          {
            title: 'Code Review Mode',
            text: `Act as a senior engineer reviewing my codebase. For any code I share: 1) Identify bugs and security issues first, 2) Flag code smells and suggest refactors, 3) Check for edge cases I may have missed. Ask for context before making any changes. Explain your reasoning in plain English before touching anything.`,
          },
        ],
      },
      {
        name: 'Cursor',
        prompts: [
          {
            title: 'Codebase Onboarding',
            text: `I've just opened this codebase in Cursor. Help me get oriented: 1) Summarize what this project does based on the files, 2) Identify the main entry points, 3) Flag any areas that look like technical debt or areas of risk. Then ask what I'm trying to build or fix today.`,
          },
          {
            title: 'Feature Build Plan',
            text: `I need to add [feature] to this project. Before writing any code: 1) Ask me about edge cases and requirements, 2) Propose an implementation plan listing every file we'll touch, 3) Get my approval before starting. Make changes incrementally — one file at a time — and explain each change before making it.`,
          },
        ],
      },
      {
        name: 'GitHub Copilot',
        prompts: [
          {
            title: 'PR Review Setup',
            text: `For every pull request I share, structure your review as: 1) One-paragraph summary of what changed, 2) Potential bugs or regressions, 3) Code quality and style feedback, 4) Questions for the author. Be concise and always prioritize critical issues over stylistic ones.`,
          },
          {
            title: 'Documentation Mode',
            text: `Help me write technical documentation for this codebase. For each function or module I share: 1) Write a clear, concise docstring, 2) Add inline comments only for non-obvious logic, 3) Draft a README section if needed. Keep language precise — explain the why, not the what.`,
          },
        ],
      },
      {
        name: 'Windsurf',
        prompts: [
          {
            title: 'Multi-File Feature',
            text: `I need to implement [feature] across multiple files. Start by mapping out which files need to change and why. Then implement changes one file at a time, explaining each change before making it. Do not move to the next file until I've reviewed and approved the current one.`,
          },
          {
            title: 'Debug Agent Mode',
            text: `I'm experiencing [describe bug]. Use your terminal and codebase access to: 1) Reproduce the issue, 2) Trace it to the root cause, 3) Propose a minimal fix with the fewest side effects. Walk me through your investigation process step by step before changing anything.`,
          },
        ],
      },
      {
        name: 'Replit AI',
        prompts: [
          {
            title: 'Project Kickstart',
            text: `I want to build [project description] in Replit. Start by: 1) Recommending the right language and framework for my goal, 2) Setting up the initial file structure, 3) Writing a working "hello world" version I can run immediately. Then ask what feature to build first.`,
          },
          {
            title: 'Deploy Prep',
            text: `My Replit project is ready to deploy. Help me: 1) Find any hardcoded secrets or credentials that should be environment variables, 2) Remove debug logs and add proper error handling, 3) Set up a basic health check endpoint. Walk me through each step before making changes.`,
          },
        ],
      },
      {
        name: 'Tabnine',
        prompts: [
          {
            title: 'Team Standards Setup',
            text: `Set up Tabnine to match our team's coding standards. Our conventions are: [describe conventions — naming, patterns, libraries]. When suggesting completions: prefer our established patterns, flag deviations from our style, and suggest variable and function names that match our naming conventions.`,
          },
          {
            title: 'Private Codebase Mode',
            text: `I'm working on proprietary code that cannot leave our environment. Configure your suggestions to: 1) Learn only from our local codebase, 2) Prioritize our internal library imports over public packages, 3) Never suggest patterns sourced from public repos. Ask me about any internal patterns you're unsure about.`,
          },
        ],
      },
    ],
  },

  /* ── 2. Content Writing & Blogging ──────────────────────────── */
  {
    id: 'content-writing',
    category: 'Content Writing & Blogging',
    icon: `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    color: 'teal',
    tools: [
      {
        name: 'Claude',
        prompts: [
          {
            title: 'Blog Writing Setup',
            text: `You are my content strategist and writer. I write [content type] for [target audience]. My brand voice is [describe — e.g. conversational but authoritative]. Before writing anything, always ask me for: target keyword, desired word count, and primary call to action. Format all posts with H2/H3 headers, short paragraphs, and a strong opening hook.`,
          },
          {
            title: 'Content Series Planner',
            text: `Help me plan a [number]-part content series on [topic]. For the series: 1) Suggest titles that build on each other logically, 2) Map out the narrative arc across all parts, 3) Define the key takeaway for each piece. Then draft a full outline for Part 1 with subheadings and supporting points.`,
          },
        ],
      },
      {
        name: 'ChatGPT',
        prompts: [
          {
            title: 'Editorial Voice Setup',
            text: `Act as my editorial assistant. My publication covers [niche] for [audience] in a [tone] voice. For every piece I work on: match my established style, flag any claims that need fact-checking, and suggest a stronger headline if mine is weak. Always ask for the keyword target before writing.`,
          },
          {
            title: 'Content Repurposing',
            text: `I have a [article/video/podcast] on [topic]. Repurpose it into: 1) A Twitter/X thread (8-10 tweets), 2) A LinkedIn post under 200 words, 3) 5 email subject line options. Keep the core message intact but adapt the format and tone for each platform.`,
          },
        ],
      },
      {
        name: 'Jasper',
        prompts: [
          {
            title: 'Brand Voice Training',
            text: `I'm setting up Jasper for [brand name]. Our brand voice is [adjectives — e.g. bold, direct, empowering]. Our audience is [describe]. When generating any content: always use active voice, avoid jargon, lead with the benefit not the feature, and close with a clear CTA. Reject any output that doesn't match this voice.`,
          },
          {
            title: 'Campaign Content Kickstart',
            text: `I'm launching a [campaign type] campaign for [product/service] with the theme [theme]. Generate: 1) 3 campaign angle options, 2) An outline for a hero long-form piece, 3) 5 supporting short-form content ideas. All content should reinforce the campaign theme consistently.`,
          },
        ],
      },
      {
        name: 'Writesonic',
        prompts: [
          {
            title: 'SEO Article Setup',
            text: `I need an SEO-optimized article targeting the keyword '[keyword]'. Before writing: 1) Confirm the search intent (informational/commercial/navigational), 2) Propose an outline with H2s and H3s, 3) Get my approval on the structure. The article should be [word count] and include the primary keyword in the first 100 words.`,
          },
          {
            title: 'Product Description Mode',
            text: `Write product descriptions for [product type] in my [brand/store]. Brand voice: [describe]. For each product: 1) Lead with the main customer benefit, 2) List 3 key features as bullet points, 3) Close with one clear CTA. Keep descriptions under 150 words and avoid superlatives without proof.`,
          },
        ],
      },
      {
        name: 'Notion AI',
        prompts: [
          {
            title: 'Content Workspace Setup',
            text: `I'm using Notion AI to manage [project/content type]. Help me set up a workspace template that includes: 1) A content calendar database with status tracking, 2) A drafts section with brief and notes fields, 3) A published archive. Ask me about my publishing frequency and team size before suggesting the structure.`,
          },
          {
            title: 'Meeting Notes to Action',
            text: `Every time I paste meeting notes, automatically: 1) Summarize the key discussion points in 3 bullets, 2) Extract all action items with owner and deadline, 3) Identify any open questions or blockers. Format the output as a clean Notion page I can share directly with my team.`,
          },
        ],
      },
      {
        name: 'Sudowrite',
        prompts: [
          {
            title: 'Story Bible Setup',
            text: `I'm starting a [genre] story. Help me build my Story Bible: 1) Establish the world rules and setting, 2) Create character profiles for my main characters, 3) Define the core conflict and what's at stake. Ask me questions until you have enough to generate consistent, on-brand story content going forward.`,
          },
          {
            title: 'Scene Development',
            text: `I'm stuck on a scene where [describe situation]. Help me: 1) Brainstorm 3 different ways this scene could unfold, 2) Write one version using "show don't tell", 3) Suggest sensory details that match my story's tone of [tone]. Don't resolve the scene — leave it on tension for now.`,
          },
        ],
      },
    ],
  },

  /* ── 3. Marketing & Copywriting ──────────────────────────────── */
  {
    id: 'marketing',
    category: 'Marketing & Copywriting',
    icon: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
    color: 'amber',
    tools: [
      {
        name: 'Copy.ai',
        prompts: [
          {
            title: 'Sales Copy Setup',
            text: `Set up Copy.ai for my [business type] selling [product/service]. My ideal customer is [describe]. My unique value proposition is [UVP]. For all copy: lead with the customer's problem, position our solution as the bridge, use social proof where possible, and close with urgency. Always give me 3 variations per output.`,
          },
          {
            title: 'Email Sequence Kickstart',
            text: `I need a [number]-email nurture sequence for [audience segment]. Map out the sequence plan first — assign each email a specific job (educate, handle objection, drive to CTA). Then write each email under 200 words with a subject line under 50 characters. Get my approval on the plan before writing.`,
          },
        ],
      },
      {
        name: 'ChatGPT',
        prompts: [
          {
            title: 'Launch Campaign Planner',
            text: `I'm launching [product/service] to [audience]. Plan my 30-day launch campaign: 1) A week-by-week content calendar, 2) Key messages for each phase (awareness, consideration, decision), 3) The single email that will drive the most conversions. Think about the emotional journey my customer takes.`,
          },
          {
            title: 'Objection Handler Script',
            text: `My product is [describe] and costs [price]. The top 3 objections I hear are: [list them]. Write a response script for each that: 1) Validates the concern without dismissing it, 2) Reframes it with a new perspective, 3) Closes with a soft CTA. Keep it conversational — not salesy.`,
          },
        ],
      },
      {
        name: 'Jasper',
        prompts: [
          {
            title: 'Ad Copy System',
            text: `Set up Jasper to generate ad copy for [product/service] on [platforms]. My target audience is [describe]. My main offer is [offer]. For every ad: write 3 headline variations under 30 characters, 3 body text variations under 125 characters, and a CTA. Test these angles: problem-aware, solution-aware, and social proof.`,
          },
          {
            title: 'Long-Form Sales Page',
            text: `Write a long-form sales page for [product/service]. Structure: 1) Headline that speaks to the core desire, 2) Problem section (agitate the pain), 3) Solution reveal, 4) Features as benefits with proof, 5) Objection handling, 6) Social proof, 7) Risk reversal (guarantee), 8) Strong CTA. Tone: [describe].`,
          },
        ],
      },
      {
        name: 'AdCreative.ai',
        prompts: [
          {
            title: 'Ad Creative Brief',
            text: `I'm launching ads for [product/service] on [platform]. My target audience is [describe]. My main offer is [offer]. Generate: 1) 3 headline options, 2) 3 primary text options, 3) A description of the visual that would perform best with each. Test these three creative angles: emotional, logical, and urgency-based.`,
          },
          {
            title: 'A/B Test Setup',
            text: `I want to A/B test my [ad/creative] against my control. Current version: [describe]. Create a challenger that changes only [one variable: headline/visual/CTA/offer]. Explain the hypothesis behind the change, predict which will win and why, and tell me which metric to use to declare a winner.`,
          },
        ],
      },
      {
        name: 'Claude',
        prompts: [
          {
            title: 'Brand Messaging Framework',
            text: `Help me build a brand messaging framework for [brand/product]. I need: 1) A one-sentence positioning statement, 2) 3 core messages for different audience segments, 3) Proof points for each message, 4) A list of words that are on-brand and off-brand. Ask me about my competitive landscape before starting.`,
          },
          {
            title: 'Conversion Copy Review',
            text: `Review my [landing page/email/ad] copy and give me a conversion-focused critique: 1) Does the headline pass the 5-second test? 2) Is the value proposition crystal clear? 3) Are there friction points that would stop someone from converting? 4) What's the single biggest copy improvement I should make first?`,
          },
        ],
      },
    ],
  },

  /* ── 4. SEO & Content Optimization ──────────────────────────── */
  {
    id: 'seo',
    category: 'SEO & Content Optimization',
    icon: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>`,
    color: 'teal',
    tools: [
      {
        name: 'Surfer SEO',
        prompts: [
          {
            title: 'Content Score Optimization',
            text: `I'm optimizing an article about [topic] targeting '[keyword]'. My current content score is [score]. Give me a prioritized list: 1) Missing NLP terms to add naturally, 2) Sections to expand based on competitor length, 3) Structural changes (headers, lists, tables) that top-ranking pages use. Focus on the highest-impact changes first.`,
          },
          {
            title: 'Topical Authority Plan',
            text: `I want to build topical authority for [niche] using Surfer SEO. Design a content hub: 1) Identify the pillar topic and 8-10 supporting cluster topics, 2) Prioritize by search volume and keyword difficulty, 3) Suggest an internal linking structure. Show me what a 3-month publishing plan looks like.`,
          },
        ],
      },
      {
        name: 'Frase',
        prompts: [
          {
            title: 'Content Brief Setup',
            text: `I'm briefing an article on [topic] targeting '[keyword]'. Based on top-ranking pages: 1) Identify the 10 most important subtopics I must cover, 2) List the key questions my article needs to answer, 3) Suggest an optimal word count. Flag any topic gap that competitors are missing that I could own.`,
          },
          {
            title: 'Optimization Pass',
            text: `I've written a draft about [topic]. Run an optimization pass: 1) List the missing NLP keywords I should naturally work in, 2) Identify sections thinner than my competitors, 3) Suggest a stronger meta description under 155 characters. Give me specific additions — not general advice.`,
          },
        ],
      },
      {
        name: 'Semrush',
        prompts: [
          {
            title: 'Competitor Content Audit',
            text: `I want to analyze my competitors' content strategy. My competitors are [list]. For each: 1) Find their top 10 organic pages by traffic, 2) Identify keyword gaps I'm not covering, 3) Find backlink opportunities I can replicate. Output a prioritized action list sorted by potential traffic impact.`,
          },
          {
            title: 'Keyword Cluster Strategy',
            text: `I'm building a content strategy for [niche]. Use Semrush to: 1) Find the top 20 keywords for this niche, 2) Group them into topic clusters, 3) Suggest a pillar page and supporting page structure. Prioritize keywords with strong search intent and realistic ranking potential for a [new/established] site.`,
          },
        ],
      },
      {
        name: 'ChatGPT',
        prompts: [
          {
            title: 'Keyword Intent Analysis',
            text: `I have this list of keywords: [paste list]. For each keyword: 1) Classify the search intent (informational, commercial, navigational, transactional), 2) Suggest the best content format to rank for it, 3) Estimate the funnel stage of the searcher. Then prioritize the list for a [new/growing] content strategy.`,
          },
          {
            title: 'Meta Description Generator',
            text: `Write meta descriptions for the following pages: [list URLs or page topics]. For each: 1) Keep it under 155 characters, 2) Include the primary keyword naturally, 3) End with an implicit or explicit CTA. Give me 2 options per page so I can choose the strongest. Avoid passive voice and filler words.`,
          },
        ],
      },
    ],
  },

  /* ── 5. Image Generation ─────────────────────────────────────── */
  {
    id: 'image-generation',
    category: 'Image Generation',
    icon: `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>`,
    color: 'purple',
    tools: [
      {
        name: 'Midjourney',
        prompts: [
          {
            title: 'Style System Setup',
            text: `I'm creating visuals for [project type]. My aesthetic is [describe — e.g. dark cyberpunk, soft painterly, clean minimalist]. Build me a Midjourney style reference: 1) Define core parameters (style, lighting, color palette, mood), 2) Write a reusable suffix I can append to any prompt, 3) Give me 3 test prompts to validate consistency. Include --ar, --v, and --style flags.`,
          },
          {
            title: 'Prompt Formula Builder',
            text: `Teach me a repeatable Midjourney prompt formula for [image type: portraits/environments/product shots/concepts]. Show me: 1) The optimal structure for this type, 2) Which parameters matter most (--chaos, --stylize, --weird, etc.), 3) How to describe lighting and mood precisely. Give me 5 example prompts I can use as templates.`,
          },
        ],
      },
      {
        name: 'DALL-E 3',
        prompts: [
          {
            title: 'Brand Visual System',
            text: `I need consistent brand visuals using DALL-E 3. My brand is [industry, tone, color palette]. Write a style guide prompt I can prepend to every image request: include color palette description, mood, composition style, and visual elements to always include or always avoid. Test it on: [describe first image needed].`,
          },
          {
            title: 'Text-in-Image Setup',
            text: `I need images with accurate, readable text for [use case: social graphics/thumbnails/ads]. For every request: 1) Put text in quotes in the prompt, 2) Keep text to 5 words or fewer per element, 3) Specify "clean bold sans-serif typography" for readability. Give me 3 example prompts for my specific use case.`,
          },
        ],
      },
      {
        name: 'Stable Diffusion',
        prompts: [
          {
            title: 'Local Model Setup',
            text: `I'm setting up Stable Diffusion locally for [use case]. Help me: 1) Choose the right base model (photorealistic/artistic/anime), 2) Recommend LoRA models to install for my style, 3) Write a starter positive and negative prompt template. Include recommended sampler, steps, and CFG scale settings for my goal.`,
          },
          {
            title: 'Consistent Character',
            text: `I need to generate a consistent character across many images for [project]. Build a character prompt: 1) Define physical attributes in Stable Diffusion syntax, 2) Write a strong negative prompt to prevent drift, 3) Suggest which checkpoint or LoRA handles character consistency best. Provide 3 test prompts for different poses and settings.`,
          },
        ],
      },
      {
        name: 'Adobe Firefly',
        prompts: [
          {
            title: 'Commercial Asset Pipeline',
            text: `I'm creating commercially-safe assets for [brand/client] using Adobe Firefly. Set up my workflow: 1) Define the visual style matching our brand guidelines, 2) Write prompt templates for [asset types: banners/product shots/backgrounds], 3) List content types to avoid for commercial licensing safety. How do I maintain consistency across a batch?`,
          },
          {
            title: 'Generative Fill Brief',
            text: `I'm using Firefly's Generative Fill in Photoshop for [project]. For each fill task, I'll describe the area and what I want. Help me write precise prompts that: 1) Match the existing image's lighting and perspective, 2) Specify realistic textures and materials, 3) Blend seamlessly with surrounding pixels. Start with: [describe first fill task].`,
          },
        ],
      },
      {
        name: 'Ideogram',
        prompts: [
          {
            title: 'Typography-First Design',
            text: `I'm creating [social graphics/posters/thumbnails] where text is the hero element. My text content is [example]. Help me write Ideogram prompts that: 1) Make text visually dominant and readable, 2) Choose backgrounds that complement without competing, 3) Apply specific typography styles (bold serif, neon, hand-lettered, etc.). Give me 5 prompt templates.`,
          },
          {
            title: 'Thumbnail System',
            text: `I'm creating thumbnails for a [channel/content type] with a [bold/clean/dramatic] style. Build me a prompt system: 1) A reusable template for text-forward thumbnails, 2) Rules for color contrast that ensure readability at small sizes, 3) Guidance on what background complexity works best at thumbnail scale. Show me 3 example prompts.`,
          },
        ],
      },
      {
        name: 'Leonardo AI',
        prompts: [
          {
            title: 'Game Asset Pipeline',
            text: `I'm generating game assets for a [genre] game with a [art style] visual style. Set up my Leonardo AI workflow: 1) Choose the right fine-tuned model for my asset type, 2) Write a base prompt structure for [characters/environments/items/UI elements], 3) Define negative prompts to maintain quality. How do I generate variations while keeping a consistent look?`,
          },
          {
            title: 'Character Sheet',
            text: `I need a full character sheet for [describe character] in Leonardo AI. Create prompts for: 1) Front view, 2) 3/4 view, 3) Action pose. Each prompt must maintain consistent: [list key visual traits — hair, clothing, colors]. Which Leonardo model handles character consistency best, and what settings should I use?`,
          },
        ],
      },
    ],
  },

  /* ── 6. Video & Media Production ────────────────────────────── */
  {
    id: 'video-production',
    category: 'Video & Media Production',
    icon: `<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>`,
    color: 'red',
    tools: [
      {
        name: 'Runway',
        prompts: [
          {
            title: 'Scene Generation Setup',
            text: `I'm creating a [short film/ad/music video] using Runway Gen-3. My visual style is [describe]. Write text-to-video prompts that specify: 1) Camera movement (pan, zoom, dolly, handheld), 2) Lighting and atmosphere, 3) Pace and energy. Give me 5 prompt templates for the shot types I'll need most.`,
          },
          {
            title: 'Motion Brief',
            text: `I'm animating a still image using Runway's Motion Brush. The image shows [describe]. Plan the motion: 1) Which elements should move and how (speed, direction, loop), 2) Which should stay completely static, 3) How to describe the motion to get natural-looking results. Write the full motion brief for this specific image.`,
          },
        ],
      },
      {
        name: 'Sora',
        prompts: [
          {
            title: 'Cinematic Prompt System',
            text: `I'm using Sora to create cinematic [content type]. My visual aesthetic is [describe]. Build me a prompt formula that includes: 1) Shot type (wide, close-up, aerial, POV), 2) Camera movement, 3) Lighting style, 4) Color grade and mood. Give me 5 ready-to-use prompts for my specific project.`,
          },
          {
            title: 'Storyboard to Prompt',
            text: `I have a [number]-shot storyboard for [project]. Convert each shot description into an optimized Sora prompt. For each shot describe: subject, action, environment, camera movement, and mood — all in one concise prompt. Keep each under 50 words. Start with: [paste first shot description].`,
          },
        ],
      },
      {
        name: 'Pika',
        prompts: [
          {
            title: 'Short-Form Video Setup',
            text: `I'm using Pika to create [social clips/ads/intros] for [platform]. My style is [describe]. Help me: 1) Write text-to-video prompts under 40 words that get sharp results, 2) Set my default aspect ratio and fps for this platform, 3) Give me 5 prompt templates for my most common video needs.`,
          },
          {
            title: 'Image Animation Setup',
            text: `I want to animate [describe image] in Pika. Write the motion prompt: 1) What moves and how (speed, direction), 2) What stays static, 3) Whether Pikaffects would enhance this concept. Suggest the camera movement that makes this image most compelling and give me the exact prompt to use.`,
          },
        ],
      },
      {
        name: 'HeyGen',
        prompts: [
          {
            title: 'Avatar Video Script',
            text: `I need a [product demo/training/marketing] video using a HeyGen AI avatar. Write a script: 1) Under [target length] minutes, 2) In a [professional/friendly/energetic] tone, 3) With natural pause cues and emphasis markers for the avatar. The core message is [message] and the CTA is [CTA].`,
          },
          {
            title: 'Multilingual Campaign',
            text: `I'm creating [product] videos in [list languages] using HeyGen. Help me: 1) Write the master English script, 2) Flag phrases that won't translate well culturally, 3) Plan a consistent avatar, background, and pacing for all language versions. The core message across all languages is [describe].`,
          },
        ],
      },
      {
        name: 'Synthesia',
        prompts: [
          {
            title: 'Training Video Series',
            text: `I'm building a [topic] training video series in Synthesia for [audience]. Plan it: 1) Break content into modules under 5 minutes each, 2) Write the script for Module 1, 3) Recommend the right avatar, background, and tone for this audience. The learner's goal after completing the series is [goal].`,
          },
          {
            title: 'Explainer Video Script',
            text: `Write a Synthesia explainer for [product/service]. Structure: Hook (0–15s): state the problem. Solution (15–45s): introduce the product. How it works (45–90s): 3 clear steps. CTA (90–120s): tell them exactly what to do next. Write for voice delivery — short sentences, no jargon, active voice only.`,
          },
        ],
      },
      {
        name: 'ElevenLabs',
        prompts: [
          {
            title: 'Voice Clone Prep',
            text: `I'm cloning a voice in ElevenLabs for [use case: brand narration/audiobook/podcast]. To get the cleanest clone: 1) Record at least [minutes] of audio with varied sentence types (questions, statements, exclamations), 2) Record in a quiet room with no compression or music, 3) Include these specific test phrases: [phrases]. After cloning, test with these edge-case sentences: [sentences].`,
          },
          {
            title: 'TTS Script Optimization',
            text: `Optimize this script for natural ElevenLabs text-to-speech: [paste script]. Make these changes: 1) Add [pause] markers where natural breaks belong, 2) Capitalize words that need spoken emphasis, 3) Split sentences over 20 words into shorter ones, 4) Replace abbreviations with spoken-word equivalents. Then recommend the ElevenLabs voice that best fits this tone: [describe desired voice].`,
          },
        ],
      },
    ],
  },

  /* ── 7. Research & Analysis ──────────────────────────────────── */
  {
    id: 'research',
    category: 'Research & Analysis',
    icon: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z"/>`,
    color: 'teal',
    tools: [
      {
        name: 'Perplexity AI',
        prompts: [
          {
            title: 'Research Deep Dive',
            text: `I'm researching [topic] for [purpose: article/business decision/learning]. Set up my session: 1) Give me an overview with key subtopics, 2) For each subtopic find 2-3 high-quality sources, 3) Flag what's disputed or unclear in the literature. Always cite sources and note when information might be outdated.`,
          },
          {
            title: 'Competitive Intelligence',
            text: `Analyze the competitive landscape for [industry/product category]. Find: 1) The 5 key players and their positioning, 2) Recent major announcements or funding, 3) Customer sentiment from reviews and social media, 4) Any clear market gaps. Summarize with a comparison table I can reference.`,
          },
        ],
      },
      {
        name: 'Perplexity Pro',
        prompts: [
          {
            title: 'Deep Research Mode',
            text: `Run a deep research session on [topic]. I need: 1) A comprehensive overview from authoritative sources, 2) Analysis of different expert perspectives, 3) The most recent data and statistics available, 4) A summary of what's still unknown or actively debated. Format as a structured report with source links.`,
          },
          {
            title: 'Market Research Report',
            text: `I'm building [product/business] and need solid market research. Find: 1) Market size and growth rate with source, 2) Key customer segments and their pain points, 3) Top 5 competitors and how they differentiate, 4) Industry trends for the next 2-3 years. Include source links for every data point you cite.`,
          },
        ],
      },
      {
        name: 'You.com Research',
        prompts: [
          {
            title: 'Multi-Source Analysis',
            text: `Research [topic] across web, academic, and news sources simultaneously. Synthesize the findings rather than just listing results. Flag conflicting information between sources and tell me your confidence level on key claims. I want analysis — not a search results page.`,
          },
          {
            title: 'Real-Time Industry Scan',
            text: `Scan for the latest developments in [industry] from the past [timeframe]. I want: 1) Major news and product announcements, 2) Regulatory or market shifts, 3) Emerging technologies or trends gaining traction. Prioritize primary sources over commentary and opinion pieces.`,
          },
        ],
      },
      {
        name: 'Claude',
        prompts: [
          {
            title: 'Document Analysis Setup',
            text: `I'm going to share a [report/paper/contract/dataset] with you. Before I do: 1) Ask me what I'm trying to learn or decide from this document, 2) Confirm how you'll present findings, 3) Ask what level of detail I need. When I share it: extract key facts, flag assumptions, identify gaps, and answer my specific questions directly.`,
          },
          {
            title: 'Research Synthesis',
            text: `I've gathered research from [number] sources on [topic] and will paste the key excerpts. Your job: 1) Identify common themes across sources, 2) Surface contradictions between sources, 3) Flag what the research doesn't answer, 4) Give me a synthesized conclusion with your confidence level on each claim.`,
          },
        ],
      },
      {
        name: 'ChatGPT',
        prompts: [
          {
            title: 'Expert Interview Prep',
            text: `I'm interviewing [type of expert] about [topic] for [purpose]. Help me prepare: 1) Write 12 smart questions that go beyond surface level, 2) Order them from broad to specific, 3) Add 2-3 follow-up probes for the most important questions. Flag which questions might get pushback and why.`,
          },
          {
            title: 'Trend Analysis',
            text: `Analyze the trend of [topic] and tell me: 1) What's driving it and where it came from, 2) Who the key players and thought leaders are, 3) Where it's likely headed in 12-24 months, 4) What opportunities or risks this creates for [my industry/business]. Use the most current data you have access to.`,
          },
        ],
      },
    ],
  },

  /* ── 8. Academic Research ────────────────────────────────────── */
  {
    id: 'academic',
    category: 'Academic Research',
    icon: `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
    color: 'purple',
    tools: [
      {
        name: 'Elicit',
        prompts: [
          {
            title: 'Literature Review Kickstart',
            text: `I'm writing a literature review on [topic] for [thesis/paper/report]. Using Elicit: 1) Find the 20 most relevant papers from the past 5 years, 2) Extract the key findings and methodology from each, 3) Identify the highest-cited papers I must include, 4) Flag any systematic reviews or meta-analyses. Organize findings by subtopic.`,
          },
          {
            title: 'Research Gap Analysis',
            text: `I want to identify research gaps in [field/topic]. Analyze the literature to: 1) Map what's been well-studied, 2) Identify contradictions or replication failures, 3) Highlight questions that papers flag as future research directions, 4) Suggest 3 research questions that haven't been adequately addressed yet.`,
          },
        ],
      },
      {
        name: 'Consensus',
        prompts: [
          {
            title: 'Scientific Evidence Summary',
            text: `What does the peer-reviewed literature say about [topic/question]? Give me: 1) The scientific consensus with confidence level, 2) Key supporting studies (sample size, methodology, population), 3) Significant dissenting or contradictory research, 4) Practical implications. Flag whether the evidence base is robust, emerging, or contested.`,
          },
          {
            title: 'Evidence-Based Fact Check',
            text: `I've seen the claim that [claim]. Find peer-reviewed research that: 1) Supports this claim with evidence, 2) Contradicts or qualifies it, 3) Identifies the conditions under which it's true or false. Give me a verdict: well-supported, partially supported, or not supported by the literature.`,
          },
        ],
      },
      {
        name: 'ScholarAI',
        prompts: [
          {
            title: 'Paper Discovery',
            text: `I'm researching [topic] and need peer-reviewed papers. Find: 1) Foundational papers that established this field, 2) High-citation recent papers (last 3 years), 3) Papers with open-access PDFs. For each: give me authors, year, key finding, and why it matters to my research. Prioritize quality over quantity.`,
          },
          {
            title: 'Citation Research',
            text: `I'm writing a [paper/report] and need citations for the claim: "[claim]". Find 3-5 peer-reviewed papers that support this. For each: 1) Give me the exact data point or quote I should cite, 2) Note the study's sample size and methodology, 3) Provide the properly formatted citation in [APA/MLA/Chicago]. Flag if the claim is contested.`,
          },
        ],
      },
      {
        name: 'Perplexity Pro',
        prompts: [
          {
            title: 'Academic Literature Scan',
            text: `Do an academic-focused deep search on [topic]. I need: 1) Key findings from recent peer-reviewed research, 2) Which universities or research institutions are leading this field, 3) Any landmark studies I must know, 4) Open questions the field is actively working on. Source everything — no unsupported claims.`,
          },
          {
            title: 'Methodology Research',
            text: `I'm designing a study on [topic] and need to understand the methodology options. Find papers that: 1) Compare different research methods for this type of question, 2) Discuss validity and reliability concerns in this field, 3) Describe common pitfalls to avoid. Summarize the methodological best practices with citations.`,
          },
        ],
      },
    ],
  },

  /* ── 9. Data Analysis ────────────────────────────────────────── */
  {
    id: 'data-analysis',
    category: 'Data Analysis',
    icon: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
    color: 'amber',
    tools: [
      {
        name: 'Julius AI',
        prompts: [
          {
            title: 'Dataset Kickstart',
            text: `I'm uploading a dataset about [describe]. Before analyzing: 1) Ask me the business question I'm trying to answer, 2) Run an initial data quality check (missing values, outliers, data types), 3) Suggest the 3 most valuable analyses for my question. Show me a preview chart before going deeper.`,
          },
          {
            title: 'Stakeholder Report',
            text: `I need a recurring analysis report on [data type] for [audience]. Set up a standard report that includes: 1) Key metrics with period-over-period comparison, 2) Top 3 trends or anomalies this period, 3) One recommended action based on the data. Format it clearly enough to share with non-technical stakeholders.`,
          },
        ],
      },
      {
        name: 'Rows',
        prompts: [
          {
            title: 'Data Dashboard Setup',
            text: `I'm connecting [data source] to Rows for analysis. Help me set up: 1) The right integrations to pull data automatically, 2) A summary dashboard showing key metrics, 3) An alert formula that flags when [metric] goes above or below [threshold]. What should I be tracking to answer [business question]?`,
          },
          {
            title: 'AI Analyst Mode',
            text: `I have data in Rows about [describe]. Ask me what I'm trying to understand. Then: 1) Identify the most important patterns in the data, 2) Build 3 charts that tell the clearest story, 3) Write a 3-sentence narrative summary I can use in a presentation. Make the output shareable and presentation-ready.`,
          },
        ],
      },
      {
        name: 'Polymer',
        prompts: [
          {
            title: 'Dashboard Kickstart',
            text: `I'm uploading [data type] to Polymer. My audience is [executives/ops team/clients]. Help me: 1) Choose the 5 most important metrics to show this audience, 2) Pick the right chart type for each metric, 3) Set up filters my audience will actually use. What story should this dashboard tell in one glance?`,
          },
          {
            title: 'Data Storytelling',
            text: `I want to turn my [data source] data into a shareable report in Polymer. The key insight I want to communicate is [insight]. Help me: 1) Choose visualizations that make this insight obvious, 2) Write concise narrative text for each chart, 3) Cut anything that distracts from the main message. Target: 5 charts or fewer.`,
          },
        ],
      },
      {
        name: 'ChatGPT',
        prompts: [
          {
            title: 'Analysis Framework',
            text: `I'm analyzing [data type] to answer: [business question]. Set up my analysis: 1) What data I actually need vs. what's noise, 2) The right statistical approach for this question, 3) Potential confounding variables to control for, 4) What a meaningful result looks like vs. statistical noise. I'll share the data via Code Interpreter.`,
          },
          {
            title: 'Python Analysis Script',
            text: `Write a Python script to [describe analysis task]. Requirements: 1) Read from [CSV/Excel/API], 2) Clean data and handle missing values, 3) Perform [analysis type], 4) Output a clear visualization saved to file. Comment each step. Start with the simplest working version — we'll refine from there.`,
          },
        ],
      },
    ],
  },

  /* ── 10. Productivity & Knowledge Management ─────────────────── */
  {
    id: 'productivity',
    category: 'Productivity & Knowledge',
    icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
    color: 'teal',
    tools: [
      {
        name: 'Notion',
        prompts: [
          {
            title: 'Project Workspace Setup',
            text: `Build me a Notion workspace for [project type]. I need: 1) A project dashboard with status, timeline, and key metrics, 2) A task database with priority, owner, and due date fields, 3) A meeting notes template with auto-date, 4) A resources hub. Ask me about my team size and workflow before proposing the structure.`,
          },
          {
            title: 'Knowledge Base Architecture',
            text: `I need to organize [company/topic] knowledge in Notion so anything can be found in under 30 seconds. Design a structure that: 1) Scales as we add more content, 2) Works for both quick reference and deep reading, 3) Requires minimal maintenance. Suggest the top-level pages and explain what goes in each.`,
          },
        ],
      },
      {
        name: 'Notion AI',
        prompts: [
          {
            title: 'Document Intelligence',
            text: `Use Notion AI to help me manage [project/knowledge area]. For every document I add: 1) Generate a 3-sentence summary, 2) Extract key action items and decisions, 3) Suggest related pages in my workspace. Create a page template that makes this automatic for every new document going forward.`,
          },
          {
            title: 'Workspace Q&A',
            text: `Set up Notion AI to answer questions about my workspace. My workspace contains [company wiki/project docs/research notes]. For any question I ask: 1) Search relevant pages, 2) Give a direct answer with the source page linked, 3) Flag if the information might be outdated. Answer my first question: [question].`,
          },
        ],
      },
      {
        name: 'Mem',
        prompts: [
          {
            title: 'Second Brain Setup',
            text: `I want to use Mem as my second brain for [topic/role]. Set up my capture system: 1) What types of notes are worth saving vs. skipping, 2) How to structure notes for maximum future searchability, 3) A daily review prompt to connect new notes to existing knowledge. Ask me what I most need to remember.`,
          },
          {
            title: 'Chat with Your Notes',
            text: `I have notes about [topic] in Mem and I'm working on [current project]. Find: 1) My most relevant notes for this project, 2) Patterns or insights I've noted repeatedly over time, 3) Things I've recorded but may have forgotten that are relevant right now. Surface connections I wouldn't find by searching.`,
          },
        ],
      },
      {
        name: 'Microsoft Copilot',
        prompts: [
          {
            title: '365 Workflow Setup',
            text: `I use Microsoft 365 for [work type/role]. Set up Copilot to help me: 1) Draft emails that match my [formal/professional/casual] style, 2) Summarize long email threads in 3 bullets, 3) Generate meeting agendas from notes and previous meetings. What do you need to know about my role to give better responses?`,
          },
          {
            title: 'Document Intelligence',
            text: `I'm sharing a [document type] with you. Using your Microsoft 365 integration: 1) Summarize it in under 200 words, 2) Extract all action items and deadlines, 3) Identify the 3 most important points for [specific audience]. Tell me what format you'll use for the output before starting.`,
          },
        ],
      },
    ],
  },

  /* ── 11. Business Strategy ───────────────────────────────────── */
  {
    id: 'business-strategy',
    category: 'Business Strategy',
    icon: `<path d="M18 20V10M12 20V4M6 20v-6"/>`,
    color: 'amber',
    tools: [
      {
        name: 'Claude',
        prompts: [
          {
            title: 'Strategic Advisor Setup',
            text: `Act as a strategic advisor for my [business type]. Our current situation: [describe]. For every strategic question I bring: 1) Apply a relevant framework (SWOT, Porter's 5 Forces, Jobs-to-be-Done, etc.), 2) Give 3 options with clear tradeoffs, 3) Make a recommendation with your reasoning. Push back if my assumptions seem flawed.`,
          },
          {
            title: 'Business Plan Review',
            text: `I'm developing a business plan for [idea]. Review it section by section: 1) Challenge any assumptions that seem optimistic, 2) Identify the biggest risks I haven't addressed, 3) Point out what's missing vs. a complete business plan. Ask me to share one section at a time, starting with the executive summary.`,
          },
        ],
      },
      {
        name: 'ChatGPT',
        prompts: [
          {
            title: 'Market Entry Analysis',
            text: `I'm considering entering [market/geography] with [product/service]. Analyze: 1) Market size and realistic addressable portion, 2) Key competitors and their exploitable weaknesses, 3) Barriers to entry, 4) My most realistic customer acquisition path. Give me a go/no-go recommendation with your reasoning.`,
          },
          {
            title: 'Pitch Deck Coach',
            text: `Coach me through building a pitch for [investor/partner/client]. Tell me the 10 slides every strong pitch needs, then for each slide ask me the hard questions the audience will ask. Flag where my story is weakest before I finalize it. Start with: what problem does my product solve?`,
          },
        ],
      },
      {
        name: 'Gemini Advanced',
        prompts: [
          {
            title: 'Google Workspace Strategy',
            text: `I use Google Workspace for [business function/role]. Help me set up Gemini to: 1) Generate templates for my most common Docs and Sheets, 2) Manage high-volume Gmail more efficiently, 3) Prepare better for meetings using my Calendar and Docs. Ask me about my specific role and workflow first.`,
          },
          {
            title: 'Multimodal Business Analysis',
            text: `I'm going to share [charts/reports/images] related to [business problem]. Analyze them together and: 1) Identify patterns across all inputs, 2) Give data-driven insights I might have missed, 3) Suggest what additional data I should gather to fill gaps. Tell me what you see in each input before synthesizing.`,
          },
        ],
      },
      {
        name: 'Grok',
        prompts: [
          {
            title: 'Real-Time Market Sentiment',
            text: `I want to understand real-time market sentiment about [topic/company/trend] using your X data access. Find: 1) What practitioners and industry people are actively discussing right now, 2) Key voices driving the conversation, 3) Sentiment trend over the past [timeframe], 4) Any emerging narratives I should factor into my strategy.`,
          },
          {
            title: 'Trend Spotting for Strategy',
            text: `I'm tracking emerging trends in [industry] for strategic planning. Use your real-time X access to: 1) Find what's gaining momentum before it goes mainstream, 2) Identify who's leading the conversation, 3) Separate genuine signal from hype. Give me the top 5 trends with evidence for each from actual X activity.`,
          },
        ],
      },
    ],
  },

  /* ── 12. Social Media ────────────────────────────────────────── */
  {
    id: 'social-media',
    category: 'Social Media',
    icon: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
    color: 'purple',
    tools: [
      {
        name: 'ChatGPT',
        prompts: [
          {
            title: 'Content Calendar Setup',
            text: `I manage [platform(s)] for [brand/personal brand] in the [niche] space. Set up my monthly content system: 1) Define my 4-5 content pillars, 2) Assign posting frequency per pillar, 3) Give me a 2-week content calendar with specific post ideas. My brand voice is [describe]. My audience is [describe].`,
          },
          {
            title: 'Viral Hook Formula',
            text: `I create content for [platform] about [topic]. Teach me a repeatable hook formula: 1) Show me 5 hook types that consistently perform on this platform, 2) Give me 10 example hooks for my specific topic, 3) Create a fill-in-the-blank template I can use every time. Explain the psychology behind why each hook works.`,
          },
        ],
      },
      {
        name: 'Claude',
        prompts: [
          {
            title: 'Brand Voice Guide',
            text: `Help me define my social media brand voice for [platform]. I want to be known as [3 adjectives]. My audience is [describe]. Create: 1) A voice guide with 5 dos and 5 don'ts, 2) 5 example posts that show the voice in action, 3) A list of words and phrases that are on-brand and off-brand. This becomes my content rulebook.`,
          },
          {
            title: 'Community Response Framework',
            text: `I get [volume] comments and DMs per [day/week] on [platform] about [topic]. Build me a response framework: 1) Templates for the 8 most common comment types I receive, 2) Rules for when to respond publicly vs. privately, 3) How to handle criticism or negative comments without escalating. Keep my brand voice [describe] throughout.`,
          },
        ],
      },
      {
        name: 'Grok',
        prompts: [
          {
            title: 'X Strategy Setup',
            text: `I'm building my X presence about [topic]. Using your real-time X access: 1) Find the top 10 accounts in my niche and analyze what makes their content perform, 2) Identify trending conversations I could add value to, 3) Suggest my ideal content angle based on what's underrepresented in my niche right now.`,
          },
          {
            title: 'Trending Content Finder',
            text: `Find me trending conversations on X right now about [topic/industry]. For each trend: 1) Summarize what the discussion is actually about, 2) Identify the unique or contrarian angle I could take, 3) Draft a tweet that adds genuine value — not just engagement-bait. I want to participate meaningfully, not just chase reach.`,
          },
        ],
      },
      {
        name: 'Gemini Advanced',
        prompts: [
          {
            title: 'YouTube Content Strategy',
            text: `I'm planning a YouTube channel about [topic] for [audience]. Using your Google and YouTube integration: 1) Find top-performing videos in my niche and what they have in common, 2) Identify content gaps I could fill, 3) Suggest 10 video ideas with title and thumbnail concepts. What title and thumbnail pattern performs best in this niche?`,
          },
          {
            title: 'Multi-Platform Repurposing',
            text: `I create content on [primary platform] about [topic]. Build me a repurposing system: 1) Map out how to adapt each piece for YouTube, TikTok, Instagram, LinkedIn, and X, 2) Show how tone and format should shift for each platform, 3) Give me a weekly workflow to publish everywhere without burning out.`,
          },
        ],
      },
    ],
  },

];
