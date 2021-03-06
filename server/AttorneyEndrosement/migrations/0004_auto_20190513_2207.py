# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-05-13 17:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('AttorneyEndrosement', '0003_auto_20190507_1749'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attorneyendrosement',
            name='fromLawyer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fromU', to='Lawyer.Lawyer'),
        ),
        migrations.AlterField(
            model_name='attorneyendrosement',
            name='toLawyer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='toU', to='Lawyer.Lawyer'),
        ),
    ]
