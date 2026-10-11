-- Replace has_role() calls in policies with inline admin lookups, then lock down the function

-- user_roles: self-read only (breaks recursion)
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- leads
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can view all leads" ON public.leads FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- calls
DROP POLICY IF EXISTS "Admins can view calls" ON public.calls;
DROP POLICY IF EXISTS "Admins can update calls" ON public.calls;
DROP POLICY IF EXISTS "Admins can delete calls" ON public.calls;
CREATE POLICY "Admins can view calls" ON public.calls FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can update calls" ON public.calls FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can delete calls" ON public.calls FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- callback_requests
DROP POLICY IF EXISTS "Admins can view callback_requests" ON public.callback_requests;
DROP POLICY IF EXISTS "Admins can update callback_requests" ON public.callback_requests;
DROP POLICY IF EXISTS "Admins can delete callback_requests" ON public.callback_requests;
CREATE POLICY "Admins can view callback_requests" ON public.callback_requests FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can update callback_requests" ON public.callback_requests FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can delete callback_requests" ON public.callback_requests FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- do_not_call
DROP POLICY IF EXISTS "Admins can view do_not_call" ON public.do_not_call;
DROP POLICY IF EXISTS "Admins can update do_not_call" ON public.do_not_call;
DROP POLICY IF EXISTS "Admins can delete do_not_call" ON public.do_not_call;
CREATE POLICY "Admins can view do_not_call" ON public.do_not_call FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can update do_not_call" ON public.do_not_call FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can delete do_not_call" ON public.do_not_call FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- analysis_reports
DROP POLICY IF EXISTS "Admins can view all reports" ON public.analysis_reports;
DROP POLICY IF EXISTS "Admins can insert reports" ON public.analysis_reports;
DROP POLICY IF EXISTS "Admins can update reports" ON public.analysis_reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON public.analysis_reports;
CREATE POLICY "Admins can view all reports" ON public.analysis_reports FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can insert reports" ON public.analysis_reports FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can update reports" ON public.analysis_reports FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Admins can delete reports" ON public.analysis_reports FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- Lock down the SECURITY DEFINER function: no longer callable from the Data API
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;