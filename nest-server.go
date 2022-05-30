package main

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Scheme != "https" {
		log.Printf("scheme: %v", r.URL.String())
	}
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	http.ServeFile(w, r, "./assets/index.html")
}

func contact(_ http.ResponseWriter, request *http.Request) {
	err := request.ParseForm()
	if err != nil {
		log.Println(err)
		return
	}
	log.Println(request.Form)
	form := request.Form
	// send to leadership@nestatandersonmill.com
	smtpServer := getEnv("NEST_EMAIL_SERVER")
	user := "fccuthbertson@gmail.com"
	//user := getEnv("CONTACT_FORM_USER")
	//pwd := getEnv("CONTACT_FORM_PWD")
	pwd := "uenuirnjyvhtasuf"
	recipient := getEnv("CONTACT_FORM_TO")
	sender := getEnv("CONTACT_FORM_FROM")

	auth := smtp.PlainAuth("", user, pwd, smtpServer)
	to := []string{recipient}
	from := sender
	name := form.Get("name")
	email := form.Get("email")
	message := form.Get("message")
	msg := fmt.Sprintf("From: %v %v\n"+
		"Subject: New Nest Contact!"+
		"%v", name, email, message)
	msgBytes := []byte(msg)
	err = smtp.SendMail(smtpServer+":587", auth, from, to, msgBytes)
	if err != nil {
		log.Println(err)
		return
	}
}

func getEnv(k string) string {
	v, ok := os.LookupEnv(k)
	if !ok {
		log.Printf("env var: %v not set", k)
		return ""
	}
	log.Printf("key: %v val: %v", k, v)
	return v
}

func register() *http.ServeMux {
	mux := http.NewServeMux()
	staticHandler := http.FileServer(http.Dir("./assets"))
	mux.Handle("/assets/", http.StripPrefix("/assets", staticHandler))
	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/contact", contact)

	return mux
}

func listen(mux *http.ServeMux) {

	go func() {
		log.Println("listening on :8443")
		err := http.ListenAndServeTLS(":8443", "server.crt", "server.key", mux)
		if err != nil {
			log.Println(err)
		}
	}()
	log.Println("listening on : 8080")
	log.Fatal(http.ListenAndServe(":8080", http.HandlerFunc(redirectToTLS)))
}
func redirectToTLS(w http.ResponseWriter, r *http.Request) {
	host := r.Host
	// need to split host from port
	s := strings.Split(host, ":")
	log.Printf("redirect host: %v", s[0])
	http.Redirect(w, r, "https://"+s[0]+":8443"+r.RequestURI, http.StatusMovedPermanently)
}

func main() {
	mux := register()
	listen(mux)
}
