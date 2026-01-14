"use client";

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import profileApi, { Recipient } from '@/lib/api/profileApi';
import { Container } from '@/components/layout/Container/Container';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button/Button';

export default function ProfilePage() {
	const email = useAppSelector((s: any) => s.auth.user?.email) as string | undefined;
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<{
		userMail: string;
		firstName: string;
		lastName: string;
		middleName: string;
		address: string;
		phone: string;
		description: string;
	}>({
		userMail: email ?? '',
		firstName: '',
		lastName: '',
		middleName: '',
		address: '',
		phone: '',
		description: '',
	});

	useEffect(() => {
		if (!email) return;
		setLoading(true);
		profileApi
			.getUserInfo(email)
			.then((data) => {
				const r = data.recipient ?? {};
				setForm({
					userMail: data.userMail ?? email,
					firstName: r.firstName ?? '',
					lastName: r.lastName ?? '',
					middleName: r.middleName ?? '',
					address: r.address ?? '',
					phone: r.phone ?? '',
					description: r.description ?? '',
				});
			})
			.catch((err) => {
				console.error(err);
				setError(String(err));
			})
			.finally(() => setLoading(false));
	}, [email]);

	useEffect(() => {
		if (email) setForm((f) => ({ ...f, userMail: email }));
	}, [email]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	}

	async function handleSave(e?: React.FormEvent) {
		e?.preventDefault();
		setSaving(true);
		setError(null);
		try {
			const body = {
				userMail: form.userMail,
				description: form.description,
				firstName: form.firstName,
				middleName: form.middleName,
				lastName: form.lastName,
				address: form.address,
				phone: form.phone,
			};

			await profileApi.updateRecipient(body);
			alert('Сохранено');
		} catch (err) {
			console.error(err);
			setError(String(err));
			alert('Ошибка при сохранении');
		} finally {
			setSaving(false);
		}
	}

	return (
        <Container>
            <main className={styles.page}>
                <h1>Профиль</h1>

                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <form className={styles.form} onSubmit={handleSave}>
                        <div className={styles.field}>
                            <label>Почта</label>
                            <Input className={styles.input} name="userMail" value={form.userMail} onChange={handleChange} disabled />
                        </div>

                        <div className={styles.field}>
                            <label>Имя</label>
                            <Input className={styles.input} name="firstName" value={form.firstName} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Фамилия</label>
                            <Input className={styles.input} name="lastName" value={form.lastName} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Отчество</label>
                            <Input className={styles.input} name="middleName" value={form.middleName} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Адрес</label>
                            <Input className={styles.input} name="address" value={form.address} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Номер телефона</label>
                            <Input className={styles.input} name="phone" value={form.phone} onChange={handleChange} />
                        </div>

                        <div className={styles.field}>
                            <label>Описание</label>
                            <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} />
                        </div>

                        <div>
                            <Button type="submit" disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</Button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                )}
            </main>
        </Container>
	);
}

