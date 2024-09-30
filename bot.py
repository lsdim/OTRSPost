from telegram.ext import Updater, MessageHandler, Filters

def handle_message(update, context):
    chat_id = update.message.chat_id
    text = update.message.text

    # Реакція на повідомлення
    if "привіт" in text.lower():
        context.bot.send_message(chat_id=chat_id, text="Привіт! Як справи?")
    elif "бот" in text.lower():
        context.bot.send_message(chat_id=chat_id, text="Я тут!")
    elif "заявк" in text.lower():
        context.bot.send_message(chat_id=chat_id, text="Всі заявки в мене на контролі!")

def main():
    updater = Updater("7255647619:AAH0dKnIaCsFRx7Dg2qyezOWuum4ItZBkec", use_context=True)
    dp = updater.dispatcher

    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
