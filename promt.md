Use the `design-taste-frontend` skill to professionally redesign the UI/UX of my existing website.

**Project**
- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Components: shadcn/ui, magic ui, aceternity UI (if installed)
- Running at: `http://localhost:3000/register`
- Target: /register

**Scope: FULL REDESIGN**

Create a new, distinctive visual direction and rebuild sections where necessary. Improve the user experience without changing the application's existing functionality.

**Design direction**
- Modern, premium, minimalist, and professional.
- Strong typography and clear visual hierarchy.
- Balanced whitespace and consistent spacing.
- Refined layouts, navigation, cards, buttons, and forms.
- Cohesive colors with restrained accents.
- Smooth, purposeful microinteractions.
- Fully responsive across desktop, tablet, and mobile.
- Avoid generic AI-generated designs, excessive gradients, especially purple gradients, and unnecessary visual effects.

**Must stay unchanged**
- Existing framework, architecture, and styling method.
- All application routes and navigation destinations.
- Backend logic, API endpoints, and database integration.
- Authentication and authorization flows.
- Forms, validation rules, and submitted data.
- Existing functional features.
- Brand identity, logo, and required content.
- Existing assets unless replacement is explicitly justified.

**What is wrong today**
- The design feels too generic and template-like.
- Visual hierarchy and typography lack refinement.
- Spacing, alignment, and component styling are inconsistent.
- Some sections are not optimized for mobile.
- The interface needs a stronger and more cohesive visual identity.

**Our own pictures:** `public/`

**Required workflow**

1. **Before Audit**
   - Inspect the running website using browser tools.
   - Capture desktop and mobile screenshots into `.taste-skill/before`.
   - Review existing components and frontend architecture.
   - Run lint and TypeScript checks.
   - Record existing interactions and functionality.

2. **Redesign**
   - Follow the `design-taste-frontend` skill in its prescribed order.
   - Refine typography first.
   - Establish the color system.
   - Rebuild page frames, layouts, and section composition.
   - Improve interaction, focus, loading, error, and success states.
   - Refine existing components and remove unnecessary visual clutter.
   - Maintain consistent design tokens across all pages.

3. **Implementation**
   - Modify the actual project files.
   - Create reusable, accessible TypeScript components.
   - Preserve all existing application behavior.
   - Ensure mobile-first responsive design.
   - Avoid introducing unnecessary dependencies.

4. **After Audit**
   - Inspect the redesigned website again.
   - Capture screenshots into `.taste-skill/after`.
   - Test every previously working link, menu, button, and form.
   - Verify layouts at 375px, 768px, 1024px, and 1440px.
   - Run lint, TypeScript checks, and production build.
   - Fix regressions before finishing.

5. **Final Report**
   - Explain the new design direction.
   - List modified files.
   - Compare before/after screenshots and actual measurements side by side.
   - Report lint, build, responsiveness, accessibility, and functional testing results.
   - Clearly identify anything that could not be verified.

**Important:** Do not stop after providing recommendations or mockups. Implement the redesign directly in the project. Do not claim successful testing without actually running the relevant checks.