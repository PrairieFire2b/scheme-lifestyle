(use-modules  (scheme eval)
              (hoot interaction-environment))
(values
  (lambda* (s #:optional env)
    (if (eqv? env #f) 
      (eval (read (open-input-string s)) (interaction-environment))
      (eval (read (open-input-string s)) env)))
  environment) ;; reserved for future development
