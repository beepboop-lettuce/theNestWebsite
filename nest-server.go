package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"
)

func handler(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Path
	if file == "/" {
		file = "index"
	}
	url := "./assets/" + file + ".html"
	http.ServeFile(w, r, url)
}

func contact(w http.ResponseWriter, request *http.Request) {
	err := request.ParseForm()
	if err != nil {
		log.Println(err)
		return
	}
	log.Println(request.Form)
	form := request.Form
	// send to leadership@nestatandersonmill.com
	smtpServer := "smtp.gmail.com"
	user := "leadership@nestatandersonmill.com"
	//user := getEnv("CONTACT_FORM_USER")
	//pwd := getEnv("CONTACT_FORM_PWD")
	pwd := "fiodqjxkjyvedtny"
	recipient := "leadership@nestatandersonmill.com"
	sender := "contact@nestatandersonmill.com"

	auth := smtp.PlainAuth("", user, pwd, smtpServer)
	to := []string{recipient}
	from := sender
	name := form.Get("name")
	email := form.Get("email")
	message := form.Get("message")
	token := form.Get("token")
	log.Println(token)

	var gReq = &struct {
		Secret   string `json:"secret"`
		Response string `json:"response"`
	}{
		Secret:   "6LcefXYgAAAAAFYVyMSEK_EXBRtw8R4PZOycodO6",
		Response: token,
	}

	b, err := json.Marshal(gReq)
	resp, err := http.Post("https://www.google.com/recaptcha/api/siteverify", "application/json", bytes.NewBuffer(b))
	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		log.Println(err)
		return
	}
	log.Printf("g-captcha-result: %v", result)
	msg := fmt.Sprintf(
		"New Nest Contact!\n"+
			"From: %v\n"+
			"Email: %v\n"+
			"Message: %v\n", name, email, message)
	msgBytes := []byte(msg)
	err = smtp.SendMail(smtpServer+":587", auth, from, to, msgBytes)
	if err != nil {
		log.Println(err)
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write([]byte("Contact Submitted"))
	return
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
	mux.HandleFunc("/contact", contact)
	mux.HandleFunc("/", handler)

	return mux
}

func listen(mux *http.ServeMux) {

	tlsPort := getEnv("NEST_TLS_PORT")
	port := getEnv("NEST_PORT")
	go func() {
		log.Printf("listening on :%v", tlsPort)
		err := http.ListenAndServeTLS(":"+tlsPort, "./certificate.crt", "./private.key", mux)
		if err != nil {
			log.Println(err)
		}
	}()
	log.Printf("listening on :%v", port)
	log.Fatal(http.ListenAndServe(":"+port, http.HandlerFunc(redirectToTLS)))
}
func redirectToTLS(w http.ResponseWriter, r *http.Request) {
	host := r.Host
	s := strings.Split(host, ":")
	log.Printf("redirect host: %v", s[0])
	http.Redirect(w, r, "https://"+s[0]+r.RequestURI, http.StatusMovedPermanently)
}

func main() {
	mux := register()
	listen(mux)
}
