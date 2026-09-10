BEGIN;

-- Lovable's 20260821200430 hardening removed authenticated access to has_role.
-- The July launch branch added this policy after the branches diverged. Use
-- the same self-scoped role lookup so the unified release retains admin access
-- without restoring the SECURITY DEFINER function to the public Data API.
DROP POLICY IF EXISTS "Admins can view audit requests" ON public.audit_requests;
CREATE POLICY "Admins can view audit requests"
  ON public.audit_requests FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
  ));

COMMIT;
